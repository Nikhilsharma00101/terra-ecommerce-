'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Tag, CreditCard, User, RefreshCw, ChevronRight, Scale, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', icon: FileText, title: 'General Conditions', subtitle: 'Rules of engagement' },
    { id: 'products', icon: Tag, title: 'Products & Pricing', subtitle: 'Our offerings' },
    { id: 'medical', icon: AlertTriangle, title: 'Medical Disclaimer', subtitle: 'Health & safety' },
    { id: 'billing', icon: CreditCard, title: 'Billing Accuracy', subtitle: 'Transaction integrity' },
    { id: 'privacy', icon: User, title: 'Personal Identity', subtitle: 'Data governance' },
    { id: 'modifications', icon: RefreshCw, title: 'Modifications', subtitle: 'Policy updates' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map(sec => {
        const el = document.getElementById(sec.id);
        return { id: sec.id, offset: el ? el.getBoundingClientRect().top : 0 };
      });
      
      const current = offsets.filter(o => o.offset < 300).pop();
      if (current) setActiveSection(current.id);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#141414] pb-24 selection:bg-[#2D4438] selection:text-white font-sans overflow-hidden">
      
      {/* Top Nav Breadcrumb - Sticky Premium Dark */}
      <div className="border-b border-white/5 bg-[#141414]/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#A39D93]">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C6D46]">/</span>
            <Link href="/about" className="hover:text-white transition-colors">Legal</Link>
            <span className="text-[#8C6D46]">/</span>
            <span className="text-white font-semibold tracking-[0.25em]">Terms of Service</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#C4A482]">
            <Scale size={14} />
            <span>Binding Agreement</span>
          </div>
        </div>
      </div>

      {/* Premium Cinematic Header Area */}
      <div className="relative w-full bg-[#141414] text-white overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-32">
        {/* Abstract animated gradient mesh background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,_rgba(140,109,70,0.15)_0%,_transparent_70%)] blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,_rgba(45,68,56,0.2)_0%,_transparent_70%)] blur-[100px] animate-pulse" style={{ animationDuration: '12s' }}></div>
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12 mt-8">
          <div className="max-w-3xl">
            <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-[#C4A482] mb-8 font-mono font-medium backdrop-blur-md hover:bg-white/10 transition-colors cursor-default shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
              <FileText size={14} className="text-[#C4A482]" />
              <span>Legal Charter Document</span>
            </div>
            
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white font-light leading-[1.05] tracking-tight mb-8">
              Terms of <br className="hidden sm:block" />
              <span className="text-[#8C6D46] italic relative inline-block mt-2 sm:mt-0">
                Service.
                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-[#8C6D46] to-transparent opacity-50"></div>
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-[#A39D93] font-light leading-relaxed max-w-xl border-l-2 border-[#8C6D46]/50 pl-5">
              Welcome to Terra Men&apos;s Co. By accessing our dispensaries or purchasing our botanical formulations, you agree to be bound by this charter of terms. Excellence dictates absolute clarity.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 text-left lg:text-right shrink-0">
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-5 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/30 hover:-translate-y-1 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 block text-[9px] text-[#A39D93] uppercase tracking-widest font-mono mb-2 flex items-center gap-2 lg:justify-end">
                <RefreshCw size={10} /> Effective Date
              </span>
              <span className="relative z-10 block text-lg font-serif text-white">Sept 15, 2026</span>
            </div>
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-5 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/30 hover:-translate-y-1 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 block text-[9px] text-[#A39D93] uppercase tracking-widest font-mono mb-2 flex items-center gap-2 lg:justify-end">
                <FileText size={10} /> Version
              </span>
              <span className="relative z-10 block text-lg font-serif text-white">2.4.0 (Global)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Gradient Transition into the Content */}
      <div className="h-24 sm:h-32 w-full bg-gradient-to-b from-[#141414] to-[#F4F1EA]"></div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Sticky Navigation */}
          <div className="lg:w-1/3 shrink-0">
            <div className="sticky top-32 space-y-2 border-l border-[#E8E2D7] pl-6 py-2">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left group flex items-center justify-between py-3 transition-colors cursor-pointer ${
                      isActive ? 'text-[#141414]' : 'text-[#77736C] hover:text-[#55524D]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white border border-[#E8E2D7] shadow-sm text-[#2D4438]' : 'bg-transparent text-[#77736C] group-hover:text-[#55524D]'}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className={`block text-xs font-semibold uppercase tracking-wider font-mono mb-1 ${isActive ? 'text-[#141414]' : ''}`}>
                          {sec.title}
                        </span>
                        <span className="block text-[10px] text-[#A39D93] font-light">
                          {sec.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${isActive ? 'translate-x-1 text-[#2D4438]' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:w-2/3 space-y-24">
            
            <section id="general" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">01. General Conditions</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p>
                  We reserve the right to refuse service to anyone for any reason at any time. The integrity of our community and the allocation of our limited-batch formulations is entirely at our discretion.
                </p>
                <p>
                  You understand that your interaction data (excluding encrypted payment credentials) may be transferred unencrypted and involve transmissions over various global networks to ensure the operational stability of Terra Men&apos;s Co.
                </p>
              </div>
            </section>

            <section id="products" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">02. Products & Pricing</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p className="font-serif text-lg text-[#141414] italic">
                  &quot;Excellence dictates scarcity.&quot;
                </p>
                <p>
                  Our formulations rely on precise botanical harvests. As such, we reserve the right to modify or discontinue any product—or alter its pricing structure—without prior notice, corresponding to the global availability of raw cold-pressed oils.
                </p>
                <p>
                  We have made every effort to display the colors and aesthetics of our apothecary glass and formulas as accurately as possible. However, due to the natural origin of our ingredients, slight color variations between batches are a mark of authenticity, not a defect.
                </p>
              </div>
            </section>

            <section id="medical" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">03. Medical Disclaimer</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <div className="bg-[#FAF8F5] border-l-2 border-[#8C6D46] p-4 text-[#141414]">
                  <p>
                    <strong>Disclaimer:</strong> Our products are formulated for external use only and are not intended to diagnose, treat, cure, or prevent any disease. Because everyone's skin is different, we highly recommend reviewing the ingredient list for any personal allergens and performing a patch test on a small area of skin 24 hours before full application. If irritation occurs, discontinue use immediately and consult a physician.
                  </p>
                </div>
              </div>
            </section>

            <section id="billing" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">04. Billing Accuracy</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p>
                  You agree to provide current, complete, and highly accurate purchase information for all transactions executed at our store. Rapid delivery of our botanicals depends entirely on the precision of the data you submit.
                </p>
                <div className="bg-[#FAF8F5] border-l-2 border-[#8C6D46] p-4 text-[#8C6D46] text-xs font-mono">
                  <p>NOTICE: We reserve the right to immediately cancel orders that, in our sole diagnostic judgment, appear to be placed by unauthorized resellers or mass distributors.</p>
                </div>
              </div>
            </section>

            <section id="privacy" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">05. Personal Identity</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p>
                  Your submission of personal information through the store is governed rigidly by our Privacy Policy. The protection of your identity is considered a core operational mandate at Terra Men&apos;s Co.
                </p>
                <Link href="/privacy-policy" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#2D4438] hover:text-[#141414] transition-colors mt-4">
                  Review Privacy Policy <ChevronRight size={14} />
                </Link>
              </div>
            </section>

            <section id="modifications" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">06. Modifications</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p>
                  You can review the most current iteration of the Terms of Service at any time on this page.
                </p>
                <p>
                  We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms by posting updates to our website. It is your responsibility to check our website periodically for systemic changes.
                </p>
              </div>
            </section>

            <div className="pt-8 text-center pb-8">
              <p className="text-xs font-mono text-[#A39D93] uppercase tracking-widest">
                Last Audited & Updated: September 15, 2026
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
