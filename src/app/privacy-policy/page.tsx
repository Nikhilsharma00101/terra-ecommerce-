'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Database, Lock, Eye, Mail, ShieldCheck, ChevronRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('collection');

  const sections = [
    { id: 'collection', icon: Database, title: 'Data Collection', subtitle: 'What we gather' },
    { id: 'usage', icon: Eye, title: 'Information Usage', subtitle: 'How we apply it' },
    { id: 'security', icon: Lock, title: 'Data Security', subtitle: 'Your protection' },
    { id: 'sharing', icon: Shield, title: 'Third-Party Sharing', subtitle: 'Strict confidentiality' },
    { id: 'contact', icon: Mail, title: 'Contact Us', subtitle: 'Reach the team' }
  ];

  // Simple scrollspy
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#181817] pb-24 selection:bg-[#2D4438] selection:text-white font-sans overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B0000]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2D4438]/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Top Nav Breadcrumb */}
      <div className="border-b border-[#E8E2D7] bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#77736C]">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-[#181817] transition-colors">Home</Link>
            <span className="text-[#C4A482]">/</span>
            <Link href="/about" className="hover:text-[#181817] transition-colors">Legal</Link>
            <span className="text-[#C4A482]">/</span>
            <span className="text-[#181817] font-semibold">Privacy Policy</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#8B0000]" />
            <span>Encrypted & Secured</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 relative z-10">
        
        {/* Cinematic Header */}
        <div className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#E8E2D7] pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#E8E2D7] bg-white text-[10px] uppercase tracking-widest text-[#2D4438] mb-6 font-mono font-semibold">
              <Lock size={12} />
              <span>Strict Confidentiality</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl text-[#181817] font-light leading-tight tracking-tight">
              Our Commitment <br/><span className="text-[#8C6D46] italic">to Your Privacy.</span>
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-sm text-[#55524D] font-light leading-relaxed border-l-2 border-[#8C6D46] pl-4">
              At Terra Men&apos;s Co., discretion and trust are foundational. This document outlines our uncompromising standards for protecting your personal data, ensuring your information remains entirely under your control.
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
                      isActive ? 'text-[#181817]' : 'text-[#77736C] hover:text-[#55524D]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white border border-[#E8E2D7] shadow-sm text-[#2D4438]' : 'bg-transparent text-[#77736C] group-hover:text-[#55524D]'}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className={`block text-xs font-semibold uppercase tracking-wider font-mono mb-1 ${isActive ? 'text-[#181817]' : ''}`}>
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
            
            <section id="collection" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#181817] font-light">01. Data Collection</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p>
                  We collect information you provide directly to us, establishing a secure profile to enhance your experience. This occurs when you create an account, initiate a purchase, or subscribe to our exclusive dispatches.
                </p>
                <div className="bg-[#FAF8F5] border border-[#E8E2D7] p-6 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-[#181817] text-xs font-mono uppercase tracking-wider mb-2">Direct Information</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="flex gap-2"><span className="text-[#8B0000]">•</span> Name & Identity</li>
                      <li className="flex gap-2"><span className="text-[#8B0000]">•</span> Encrypted Email Address</li>
                      <li className="flex gap-2"><span className="text-[#8B0000]">•</span> Secure Shipping Location</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[#181817] text-xs font-mono uppercase tracking-wider mb-2">Automated Metrics</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="flex gap-2"><span className="text-[#8B0000]">•</span> Regional IP Address</li>
                      <li className="flex gap-2"><span className="text-[#8B0000]">•</span> Interaction Analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#181817] font-light">02. Information Usage</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p>
                  Your data is solely utilized to elevate your journey with Terra. It allows us to process secure transactions, swiftly deliver your botanical formulations, and proactively communicate regarding your active orders.
                </p>
                <p>
                  Secondary utilization involves macro-analytics—understanding broader behavioral patterns to refine our digital architecture and formulate superior product iterations. We never employ invasive tracking algorithms or cross-site behavioral targeting.
                </p>
              </div>
            </section>

            <section id="security" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#181817] font-light">03. Data Security</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <div className="bg-[#FAF8F5] border-l-2 border-[#2D4438] p-6 rounded-r-lg text-[#2D4438] mb-6">
                  <p className="text-xs uppercase tracking-widest font-mono font-bold mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} /> Zero-Knowledge Financials
                  </p>
                  <p className="text-[#55524D] font-light">
                    We maintain absolute zero-knowledge of your financial credentials. Payment routing is managed strictly via PCI-DSS Level 1 compliant gateways (Razorpay). Credit card data never touches Terra&apos;s private servers.
                  </p>
                </div>
                <p>
                  Our entire infrastructure operates behind enterprise-grade cryptographic protocols. All traffic is enforced over TLS 1.3 encryption, and internal data silos are protected by rigorous access control lists (ACLs) and continuous threat monitoring.
                </p>
              </div>
            </section>

            <section id="sharing" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#181817] font-light">04. Third-Party Sharing</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p className="font-serif text-lg text-[#181817] italic">
                  &quot;We do not sell, rent, or lease your personal identity. Period.&quot;
                </p>
                <p>
                  Data sharing is strictly limited to operational necessity. We partner with elite logistics carriers (for dispatch) and certified payment processors (for transactions). These entities operate under legally binding non-disclosure agreements and are prohibited from utilizing your data for independent marketing.
                </p>
              </div>
            </section>

            <section id="contact" className="scroll-mt-32">
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-[#181817] font-light">05. Contact Us</h2>
              </div>
              <div className="space-y-6 text-sm text-[#55524D] font-light leading-relaxed bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D7] shadow-xs">
                <p>
                  You retain complete sovereignty over your data. If you wish to invoke your right to erasure, request a complete data export, or query our privacy practices, our compliance team stands ready.
                </p>
                <div className="inline-flex flex-col sm:flex-row gap-4 mt-4">
                  <a href="mailto:privacy@terramensco.com" className="px-6 py-3 bg-[#181817] text-white text-xs font-bold uppercase tracking-wider font-mono hover:bg-[#8B0000] transition-colors text-center shadow-xs">
                    privacy@terramensco.com
                  </a>
                  <div className="px-6 py-3 border border-[#E8E2D7] bg-[#FAF8F5] text-xs uppercase tracking-wider font-mono text-center">
                    Response within 24H
                  </div>
                </div>
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
