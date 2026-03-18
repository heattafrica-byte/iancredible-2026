
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Star,
  Loader2,
  ArrowRight,
  Music
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    setIsLoading(plan);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onUpgrade(plan);
    setIsLoading(null);
  };

  if (!isOpen) return null;

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for hobbyists and beginners.",
      features: [
        "Up to 4 Stems per project",
        "Standard MP3 Export",
        "Basic AI Insights",
        "Community Support"
      ],
      cta: "Current Plan",
      disabled: true,
      highlight: false
    },
    {
      name: "Pro Engineer",
      price: "$14.99",
      period: "/mo",
      description: "For serious producers and engineers.",
      features: [
        "Unlimited Stems per project",
        "High-Res WAV Export",
        "Advanced FX Processing Stage",
        "Deep Mastering Advice",
        "Priority Processing",
        "Cloud Project Sync"
      ],
      cta: "Upgrade to Pro",
      disabled: false,
      highlight: true
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-[#0a0a1a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <div className="p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Star className="w-3 h-3 fill-cyan-400" />
              Premium Experience
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">UNLOCK YOUR FULL POTENTIAL</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Upgrade to Pro and get access to high-fidelity exports, unlimited stems, and advanced AI engineering tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((p, i) => (
              <div 
                key={i} 
                className={`relative p-8 rounded-3xl border transition-all ${p.highlight ? 'bg-[#15152a] border-cyan-500/50 shadow-2xl shadow-cyan-500/10 scale-105 z-10' : 'bg-white/[0.02] border-white/10'}`}
              >
                {p.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                    Recommended
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{p.price}</span>
                    <span className="text-gray-500 font-bold">{p.period}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{p.description}</p>
                </div>

                <ul className="space-y-4 mb-10">
                  {p.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${p.highlight ? 'text-cyan-400' : 'text-gray-600'}`} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => !p.disabled && handleUpgrade(p.name)}
                  disabled={p.disabled || !!isLoading}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                    p.highlight 
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-xl shadow-cyan-500/20' 
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  } disabled:opacity-50`}
                >
                  {isLoading === p.name ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {p.cta}
                      {!p.disabled && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Secure SSL Encryption
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Instant Activation
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Cancel Anytime
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionModal;
