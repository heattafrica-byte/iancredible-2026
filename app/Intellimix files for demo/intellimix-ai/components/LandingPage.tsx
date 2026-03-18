
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic2, 
  Wand2, 
  Music, 
  Zap, 
  CheckCircle2, 
  Play, 
  Pause, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoType, setDemoType] = useState<'raw' | 'mixed'>('raw');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Placeholder audio URLs (Replace these with your actual synthwave MP3s)
  const audioUrls = {
    raw: "https://actions.google.com/sounds/v1/music/club_music_dance_loop.ogg",
    mixed: "https://actions.google.com/sounds/v1/music/cinematic_music_heroic_intro.ogg"
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio play failed:", e);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      
      audioRef.current.src = audioUrls[demoType];
      audioRef.current.currentTime = currentTime; // Try to keep them in sync
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio play failed during source switch:", e);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [demoType]); // Removed isPlaying dependency to prevent double-triggering

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: "AI-Driven Balancing",
      description: "Our neural networks analyze your stems to find the perfect level, pan, and frequency balance for your genre."
    },
    {
      icon: <Wand2 className="w-6 h-6 text-fuchsia-400" />,
      title: "Creative FX Stage",
      description: "Beyond basic mixing, IntelliMix suggests saturation, reverb, and delay settings to bring your tracks to life."
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      title: "Mastering Insights",
      description: "Get professional advice on how to finalize your stereo bus for commercial loudness and clarity."
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$0",
      features: ["Up to 4 Stems", "Standard MP3 Export", "Basic AI Insights", "Community Support"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Pro Engineer",
      price: "$14.99",
      period: "/mo",
      features: ["Unlimited Stems", "High-Res WAV Export", "Advanced FX Processing", "Deep Mastering Advice", "Priority Processing"],
      cta: "Go Pro",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Music className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">INTELLIMIX<span className="text-cyan-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-semibold transition-all"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" />
              The Future of Home Studios
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-[0.9] tracking-tighter mb-8">
              YOUR PERSONAL <br />
              <span className="inline-block text-transparent bg-clip-text [-webkit-background-clip:text] bg-gradient-to-r from-cyan-400 to-fuchsia-500">AI MIX ENGINEER</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
              Upload your stems and let IntelliMix AI handle the technical heavy lifting. Professional balance, EQ, and compression in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-xl font-bold text-lg shadow-xl shadow-cyan-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Start Mixing Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href="#demo"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                Hear the Difference
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070" 
                alt="Professional AI Studio" 
                className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-60"></div>
            </div>
            {/* Floating UI Elements */}
            <div className="absolute -top-6 -right-6 bg-[#15152a] p-4 rounded-xl border border-white/10 shadow-xl z-20 hidden sm:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">AI Analysis Active</span>
              </div>
              <div className="flex gap-1 h-8 items-end">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} className="w-1 bg-cyan-500/50 rounded-full" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">HEAR THE TRANSFORMATION</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Toggle between the raw recording and the IntelliMix AI processed version.
          </p>
          
          <div className="max-w-3xl mx-auto bg-[#15152a] rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-center gap-8 mb-10">
              <button 
                onClick={() => setDemoType('raw')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${demoType === 'raw' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                RAW STEMS
              </button>
              <div className="w-12 h-[1px] bg-white/10"></div>
              <button 
                onClick={() => setDemoType('mixed')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${demoType === 'mixed' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-white'}`}
              >
                INTELLIMIX PRO
              </button>
            </div>

            <div className="relative h-48 bg-black/40 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
              <audio ref={audioRef} src={audioUrls.raw} loop preload="auto" />
              {/* Waveform Visualization Placeholder */}
              <div className="flex items-center gap-1 w-full px-8">
                {Array.from({ length: 60 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      height: isPlaying ? [10, Math.random() * 60 + 20, 10] : 10 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.5 + Math.random(),
                      ease: "easeInOut"
                    }}
                    className={`flex-1 rounded-full ${demoType === 'mixed' ? 'bg-cyan-500/60' : 'bg-gray-600/40'}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="text-black w-8 h-8 fill-black" /> : <Play className="text-black w-8 h-8 ml-1 fill-black" />}
                </div>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span>0:00</span>
              <span className="text-cyan-400">Demo Track: "Midnight Echoes" (Synthwave)</span>
              <span>0:30</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">ENGINEERED FOR EXCELLENCE</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We've trained our AI on thousands of professional chart-topping mixes to understand the nuances of every genre.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">CHOOSE YOUR STAGE</h2>
            <p className="text-gray-400">Simple, transparent pricing for creators of all levels.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((p, i) => (
              <div 
                key={i} 
                className={`relative p-10 rounded-3xl border ${p.highlight ? 'bg-[#15152a] border-cyan-500/50 shadow-2xl shadow-cyan-500/10' : 'bg-white/[0.03] border-white/10'}`}
              >
                {p.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black">{p.price}</span>
                  <span className="text-gray-500 font-bold">{p.period}</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {p.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${p.highlight ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">TRUSTED BY THE NEXT GENERATION</h2>
            <p className="text-gray-400">Join thousands of producers who have revolutionized their workflow.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex River",
                role: "Techno Producer",
                text: "IntelliMix AI saved my EP. The frequency balance it achieved in seconds would have taken me days of ear fatigue to get right.",
                img: "https://picsum.photos/seed/person1/200/200"
              },
              {
                name: "Sarah Chen",
                role: "Singer-Songwriter",
                text: "As someone who isn't a technical engineer, this app is a godsend. It explains WHY it's making changes, which is helping me learn.",
                img: "https://picsum.photos/seed/person2/200/200"
              },
              {
                name: "Marcus Vane",
                role: "Hip Hop Artist",
                text: "The Stage 2 FX suggestions are fire. It found a saturation tone for my vocals that I never would have thought of.",
                img: "https://picsum.photos/seed/person3/200/200"
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border border-cyan-500/30" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="absolute top-8 right-8 text-white/5">
                  <Music className="w-12 h-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-cyan-600 to-fuchsia-700 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              READY TO HEAR YOUR MUSIC <br /> LIKE NEVER BEFORE?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Join 5,000+ producers who are finishing more tracks with IntelliMix AI.
            </p>
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl"
            >
              Get Started for Free
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Music className="text-cyan-400 w-5 h-5" />
          <span className="font-bold tracking-tighter text-white">INTELLIMIX<span className="text-cyan-400">AI</span></span>
        </div>
        <p className="text-gray-500 text-xs mb-8">
          © 2026 IntelliMix AI. All rights reserved. Built for the next generation of sound.
        </p>
        <div className="flex justify-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
