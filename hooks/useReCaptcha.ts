import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useCallback } from 'react';

export function useReCaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getReCaptchaToken = useCallback(
    async (action: string = 'submit'): Promise<string | null> => {
      if (!executeRecaptcha) {
        console.warn('reCAPTCHA not ready');
        return null;
      }

      try {
        const token = await executeRecaptcha(action);
        return token;
      } catch (error) {
        console.error('Failed to get reCAPTCHA token:', error);
        return null;
      }
    },
    [executeRecaptcha]
  );

  return { getReCaptchaToken };
}
