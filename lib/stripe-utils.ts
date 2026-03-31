import axios from 'axios'
import crypto from 'crypto'
import {
  createPayment,
  updatePayment,
  getSubmission,
  updateSubmission,
  createTrack,
  updateUserProfile,
} from './firestore-utils'
import { Timestamp, collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from './firebase'

// Paystack API base URL
const PAYSTACK_API_URL = 'https://api.paystack.co'
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

// Paystack headers
const paystackHeaders = {
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
}

export interface InitializePaymentParams {
  userId: string
  email: string
  amount: number // in ZAR
  type: 'submission' | 'subscription' | 'other'
  relatedId?: string
  metadata?: Record<string, any>
}

export interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

/**
 * Initialize a Paystack transaction
 */
export async function initializePayment({
  userId,
  email,
  amount,
  type,
  relatedId,
  metadata = {},
}: InitializePaymentParams) {
  try {
    // Amount in Paystack is in kobo (100 kobo = 1 ZAR)
    const amountInKobo = Math.round(amount * 100)

    const response = await axios.post<PaystackInitializeResponse>(
      `${PAYSTACK_API_URL}/transaction/initialize`,
      {
        email,
        amount: amountInKobo,
        metadata: {
          userId,
          type,
          relatedId,
          ...metadata,
        },
      },
      { headers: paystackHeaders }
    )

    if (response.data.status) {
      // Create a record in Firestore
      await createPayment({
        userId,
        stripePaymentId: response.data.data.reference,
        stripeCustomerId: email,
        amount,
        currency: 'ZAR',
        status: 'pending',
        type,
        relatedId,
        metadata: {
          accessCode: response.data.data.access_code,
          reference: response.data.data.reference,
          ...metadata,
        },
      })

      return {
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference,
      }
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    console.error('Error initializing Paystack payment:', error)
    throw error
  }
}

/**
 * Verify a Paystack transaction
 */
export async function verifyPayment(reference: string) {
  try {
    const response = await axios.get(
      `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
      { headers: paystackHeaders }
    )

    if (response.data.status && response.data.data.status === 'success') {
      return {
        success: true,
        reference: response.data.data.reference,
        amount: response.data.data.amount / 100, // Convert from kobo to ZAR
        customer: response.data.data.customer,
        metadata: response.data.data.metadata,
      }
    } else {
      return {
        success: false,
        message: 'Payment verification failed',
      }
    }
  } catch (error: any) {
    console.error('Error verifying Paystack payment:', error)
    throw error
  }
}

/**
 * Handle Paystack webhook events
 */
export async function handlePaystackWebhook(event: any) {
  const eventType = event.event

  try {
    switch (eventType) {
      case 'charge.success':
        await handlePaymentSuccess(event.data)
        break

      case 'charge.failed':
        await handlePaymentFailed(event.data)
        break

      default:
        console.log(`Unhandled Paystack event: ${eventType}`)
    }
  } catch (error) {
    console.error('Error handling Paystack webhook:', error)
    throw error
  }
}

async function handlePaymentSuccess(data: any) {
  try {
    const reference = data.reference
    const metadata = data.metadata || {}

    // Update payment in Firestore
    const paymentDoc = await findPaymentByReference(reference)
    if (!paymentDoc) {
      console.warn(`Payment not found for reference ${reference}`)
      return
    }

    await updatePayment(paymentDoc.id, {
      status: 'success',
      completedAt: Timestamp.now(),
    })

    switch (paymentDoc.type) {
      case 'submission': {
        const submissionId = paymentDoc.relatedId || metadata.relatedId
        if (!submissionId) {
          console.warn('No related submission ID provided for submission payment', paymentDoc.id)
          break
        }

        const submission = await getSubmission(submissionId)
        if (!submission) {
          console.warn(`Submission ${submissionId} not found`) 
          break
        }

        // Update submission and create track if not already approved
        if (submission.status !== 'approved') {
          await updateSubmission(submissionId, {
            status: 'approved',
            paymentStatus: 'paid',
            reviewedAt: Timestamp.now(),
            reviewedBy: 'system',
          })

          await createTrack({
            title: submission.trackTitle,
            artistId: submission.artistId,
            artistName: submission.artistName,
            audioUrl: submission.audioUrl,
            coverArt: submission.coverArtUrl,
            description: submission.bio,
            genre: submission.genre,
            releaseDate: Timestamp.now(),
            status: 'published',
            stats: {
              plays: 0,
              downloads: 0,
              likes: 0,
            },
          })
        }
        break
      }

      case 'subscription': {
        const userId = paymentDoc.userId || metadata.userId
        if (!userId) {
          console.warn('No userId for subscription payment', paymentDoc.id)
          break
        }

        await updateUserProfile(userId, {
          subscriptionStatus: 'premium',
          subscriptionId: paymentDoc.relatedId || paymentDoc.id,
        })
        break
      }

      default:
        console.log(`No side effects for payment type ${paymentDoc.type}`)
    }
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const reference = data.reference

    const paymentDoc = await findPaymentByReference(reference)
    if (paymentDoc) {
      await updatePayment(paymentDoc.id, {
        status: 'failed',
      })
    }
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

/**
 * Helper to find payment by Paystack reference
 */
async function findPaymentByReference(reference: string) {
  try {
    const q = query(
      collection(db, 'payments'),
      where('stripePaymentId', '==', reference),
      limit(1)
    )

    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as any
    }

    // Fallback to metadata reference if stored there
    const qMetadata = query(
      collection(db, 'payments'),
      where('metadata.reference', '==', reference),
      limit(1)
    )

    const metadataSnapshot = await getDocs(qMetadata)
    if (!metadataSnapshot.empty) {
      return metadataSnapshot.docs[0].data() as any
    }

    return null
  } catch (error) {
    console.error('Error finding payment by reference:', error)
    return null
  }
}

/**
 * Verify Paystack webhook signature
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  try {
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex')

    return hash === signature
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(reference: string) {
  try {
    const response = await axios.get(
      `${PAYSTACK_API_URL}/transaction/${reference}`,
      { headers: paystackHeaders }
    )

    if (response.data.status) {
      return response.data.data
    } else {
      throw new Error('Failed to fetch transaction details')
    }
  } catch (error) {
    console.error('Error fetching transaction details:', error)
    throw error
  }
}

/**
 * Cancel a transaction (if not yet completed)
 */
export async function cancelTransaction(reference: string) {
  try {
    const response = await axios.get(
      `${PAYSTACK_API_URL}/transaction/${reference}`,
      { headers: paystackHeaders }
    )

    if (response.data.status && response.data.data.status === 'pending') {
      // Paystack doesn't have a cancel endpoint, but you can handle it in your app
      return {
        success: true,
        message: 'Transaction can be cancelled by user timeouts',
      }
    }

    return {
      success: false,
      message: 'Transaction cannot be cancelled',
    }
  } catch (error) {
    console.error('Error cancelling transaction:', error)
    throw error
  }
}
