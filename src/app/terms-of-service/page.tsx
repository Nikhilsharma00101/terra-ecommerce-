'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Tag, CreditCard, User, RefreshCw, ChevronRight, Scale } from 'lucide-react';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', icon: FileText, title: 'General Conditions', subtitle: 'Rules of engagement' },
    { id: 'products', icon: Tag, title: 'Products & Pricing', subtitle: 'Our offerings' },
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
      
      {/* Top Nav Breadcrumb */}
      <div className="border-b border-[#E8E2D7] bg-[#F4F1EA]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#77736C]">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-[#141414] transition-colors">Home</Link>
            <span className="text-[#C4A482]">/</span>
            <Link href="/about" className="hover:text-[#141414] transition-colors">Legal</Link>
            <span className="text-[#C4A482]">/</span>
            <span className="text-[#141414] font-semibold">Terms of Service</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#8C6D46]">
            <Scale size={14} />
            <span>Binding Agreement</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 relative z-10">
        
        {/* Cinematic Header */}
        <div className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#E8E2D7] pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#E8E2D7] bg-white text-[10px] uppercase tracking-widest text-[#2D4438] mb-6 font-mono font-semibold">
              <FileText size={12} />
              <span>Legal Charter</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl text-[#141414] font-light leading-tight tracking-tight">
              Terms of <br/><span className="text-[#8C6D46] italic">Service.</span>
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-sm text-[#55524D] font-light leading-relaxed border-l-2 border-[#8C6D46] pl-4">
              Welcome to Terra Men&apos;s Co. By accessing our dispensaries or purchasing our botanical formulations, you agree to be bound by this charter of terms.
            </p>
          </div>
        </div>

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

            <section id="billing" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">03. Billing Accuracy</h2>
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
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">04. Personal Identity</h2>
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
                <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light">05. Modifications</h2>
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
