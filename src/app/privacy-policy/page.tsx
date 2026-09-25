import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PrivacyScrollspy } from './components/PrivacyScrollspy';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Terra Men's Co. collects, uses, and protects your personal data. We are committed to transparency and strict data security.",
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | TERRA MEN'S CO.",
    description:
      "We are committed to transparency. Learn how Terra Men's Co. handles your personal data.",
    url: 'https://www.terramensco.com/privacy-policy',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "TERRA MEN'S CO. Privacy Policy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terramensco',
    title: "Privacy Policy | TERRA MEN'S CO.",
    description:
      "We are committed to transparency. Learn how Terra Men's Co. handles your personal data.",
    images: ['/images/og/og-image.jpeg'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF7F2] font-sans text-[#111915] antialiased selection:bg-[#C4A482]/25 selection:text-[#111915] relative pb-20">
      
      {/* TOP GAZETTE UTILITY / TICKER STRIP */}
      <aside className="w-full bg-[#111915] text-[#FAF7F2] text-[11px] font-mono tracking-widest uppercase py-2 px-6 lg:px-16 border-b border-[#C4A482]/20">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2 text-[#C4A482]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A482] animate-pulse"></span>
              TERRA MEN&apos;S CO. PRIVACY POLICY
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline text-[#FAF7F2]/70">HOME • SHOP • ABOUT US • CONTACT</span>
          </div>
          <div className="flex items-center space-x-6 text-[#FAF7F2]/70">
            <span className="text-[#C4A482]/90">UPDATED: SEPT 15, 2026</span>
            <span className="text-white/30">|</span>
            <a className="hover:text-[#C4A482] transition-colors inline-flex items-center gap-1" href="#article-01">
              INDEX REFS ↓
            </a>
          </div>
        </div>
      </aside>

      {/* EDITORIAL HERO / TITLE BANNER */}
      <section className="relative w-full border-b border-[#C4A482]/30 bg-gradient-to-b from-[#F4EFEA]/60 via-[#FAF7F2] to-[#FAF7F2] pt-14 pb-16 px-6 lg:px-16 overflow-hidden">
        {/* Subtle architectural background grid line decoration */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20" 
          style={{
            backgroundSize: '80px 80px',
            backgroundImage: 'linear-gradient(to right, rgba(196,164,130,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(196,164,130,0.2) 1px, transparent 1px)'
          }}
        ></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Gazette Folio Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#C4A482]/40 pb-4 mb-10 gap-3 font-mono text-[11px] text-[#6E7771] uppercase tracking-widest">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-0.5 bg-[#111915] text-[#FAF7F2] font-mono text-[10px] tracking-widest rounded-sm">LEGAL DOC</span>
              <span className="text-[#8C6D46] font-medium">PRIVACY POLICY</span>
              <span className="hidden sm:inline">• EDITION 2.4.0 (INDIA)</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2A3D32]/10 text-[#2A3D32] border border-[#2A3D32]/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A3D32]"></span>
                DATA PROTECTION
              </span>
              <span className="hidden md:inline text-[#111915]/70">APPLICABLE IN INDIA</span>
            </div>
          </div>
          
          {/* Main Headline & Subtitle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.3em] font-medium">Legal Information & Policies</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111915] leading-[1.08] tracking-tight">
                Privacy <span className="italic font-serif font-normal text-[#8C6D46]">Policy.</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right font-mono text-[11px] text-[#6E7771] space-y-1 pb-1">
              <p className="uppercase tracking-widest"><strong className="text-[#111915] font-medium">Effective:</strong> September 15, 2026</p>
              <p className="uppercase tracking-widest"><strong className="text-[#111915] font-medium">Region:</strong> India</p>
              <p className="uppercase tracking-widest"><strong className="text-[#111915] font-medium">Jurisdiction:</strong> New Delhi, India</p>
            </div>
          </div>
          
          {/* Verbatim Preamble Parchment Banner */}
          <div className="relative rounded-lg bg-[#F4EFEA] border border-[#C4A482]/45 p-6 sm:p-9 shadow-sm">
            <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-2.5 hidden sm:block">
              <span className="px-3 py-1 bg-[#C4A482]/20 text-[#8C6D46] border border-[#C4A482]/40 font-mono text-[9px] uppercase tracking-widest rounded">
                Introduction
              </span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#8C6D46] font-serif text-4xl select-none mt-1 leading-none">&quot;</span>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#111915] leading-relaxed">
                Trust is foundational to Terra Men&apos;s Co. This document outlines in simple terms how we collect, use, and safeguard your personal information when you interact with our brand.
              </p>
            </div>
          </div>
          
          {/* Quick Metadata Indicator Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#C4A482]/20 font-mono text-[11px] uppercase tracking-widest">
            <div className="p-3 bg-[#FAF7F2] border border-[#C4A482]/30 rounded">
              <span className="text-[#6E7771] block text-[9px] tracking-[0.2em] mb-1">Status</span>
              <span className="text-[#111915] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Active • In Effect
              </span>
            </div>
            <div className="p-3 bg-[#FAF7F2] border border-[#C4A482]/30 rounded">
              <span className="text-[#6E7771] block text-[9px] tracking-[0.2em] mb-1">Version Ref</span>
              <span className="text-[#111915] font-medium">2.4.0 (India)</span>
            </div>
            <div className="p-3 bg-[#FAF7F2] border border-[#C4A482]/30 rounded">
              <span className="text-[#6E7771] block text-[9px] tracking-[0.2em] mb-1">Review Cycle</span>
              <span className="text-[#111915] font-medium">Annual</span>
            </div>
            <div className="p-3 bg-[#FAF7F2] border border-[#C4A482]/30 rounded">
              <span className="text-[#6E7771] block text-[9px] tracking-[0.2em] mb-1">Jurisdiction</span>
              <span className="text-[#111915] font-medium">Republic of India</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CURATED INDEX & ARTICLES STREAM */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Architectural Index & Marginalia (Sticky 4 cols) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
            {/* Curated Index Table */}
            <div className="bg-[#F4EFEA] rounded border border-[#C4A482]/40 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#C4A482]/30 pb-3">
                <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#111915] font-semibold">Table of Contents</h2>
                <span className="font-mono text-[10px] text-[#8C6D46]">06 SECTIONS</span>
              </div>
              <p className="font-sans text-xs text-[#6E7771] leading-relaxed">
                Click a section below to read the corresponding policies.
              </p>
              
              <PrivacyScrollspy />
              
            </div>
            
            {/* Official Dispensary Contact & Download Card */}
            <div className="p-6 rounded bg-[#111915] text-[#FAF7F2] border border-[#C4A482]/30 space-y-4">
              <div className="flex items-center space-x-2 text-[#C4A482]">
                <span className="font-mono text-xs uppercase tracking-widest font-medium">Privacy Contact</span>
              </div>
              <p className="font-sans text-xs text-[#FAF7F2]/80 leading-relaxed">
                If you have any questions regarding your data or privacy, please contact us:
                <a className="font-mono text-[#C4A482] underline underline-offset-4 hover:text-[#FAF7F2] transition-colors block mt-1" href="mailto:info@terramensco.com">info@terramensco.com</a>
              </p>
              <div className="pt-2">
                <Link className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#C4A482]/15 hover:bg-[#C4A482]/25 text-[#C4A482] text-xs font-mono uppercase tracking-widest border border-[#C4A482]/40 rounded transition-colors" href="/terms-of-service">
                  <span>View Terms of Service</span>
                </Link>
              </div>
            </div>
            
            {/* Indian Jurisdiction Notice */}
            <div className="p-5 rounded border border-dashed border-[#C4A482]/50 bg-[#F4EFEA]/70 font-mono text-[10px] space-y-2">
              <div className="flex justify-between text-[#6E7771] uppercase tracking-widest">
                <span>Data Law Compliance</span>
                <span className="text-[#2A3D32] font-semibold">INDIA</span>
              </div>
              <div className="text-[#111915] font-mono text-[11px] bg-[#FAF7F2]/80 p-2 border border-[#C4A482]/20 rounded">
                Governed by the Information Technology Act, 2000 & SPDI Rules, 2011 (India)
              </div>
              <span className="text-[#6E7771] text-[9px] uppercase tracking-wider block">Subject to New Delhi jurisdiction</span>
            </div>
          </aside>
          
          {/* RIGHT COLUMN: Verbatim Legal Articles (8 cols) */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* ARTICLE 01 */}
            <article className="scroll-mt-32 pt-2 border-t-2 border-[#111915] space-y-6" id="article-01">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 01</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">01. Data Collection</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">What we gather</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed space-y-4 font-light">
                <p>
                  We collect information you provide directly to us when you create an account, make a purchase, or subscribe to our newsletter. This includes your name, email address, shipping address, and phone number.
                </p>
                <p>
                  We also collect basic automated metrics to improve our website experience, such as your IP address and general interaction analytics. We do not store your credit card or payment information on our servers; payments are handled entirely by secure third-party gateways like Razorpay.
                </p>
              </div>
            </article>

            {/* ARTICLE 02 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-8" id="article-02">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 02</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">02. Information Usage</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">How we apply it</p>
              </div>
              
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed space-y-4 font-light">
                <p>
                  The personal information we collect is used primarily to fulfill your orders, process payments, and ensure your products reach you safely and efficiently.
                </p>
                <p>
                  Additionally, we use this information to communicate with you about your order status and, if you have opted in, to send you updates about new products or offers. We also analyze basic website traffic data to help us improve our store&apos;s design and functionality.
                </p>
              </div>
            </article>

            {/* ARTICLE 03 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-03">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 03</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">03. Third-Party Sharing</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Strict confidentiality</p>
              </div>
              
              <div className="relative py-8 px-6 sm:px-10 my-4 bg-[#F4EFEA] border-y-2 border-[#C4A482]/60">
                <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#111915] block leading-snug">
                  &quot;We never sell your data.&quot;
                </span>
              </div>
              
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light mb-6 space-y-4">
                <p>
                  We do not sell, rent, or trade your personal information to third parties. 
                </p>
                <p>
                  We only share essential information with trusted service providers who help us operate our business—such as courier services for shipping your order and secure payment gateways for processing your payment. These partners are strictly bound by confidentiality agreements.
                </p>
              </div>
            </article>

            {/* ARTICLE 04 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-04">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 04</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">04. Cookies & Tracking</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Website functionality</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light space-y-4">
                <p>
                  We use cookies and similar tracking technologies to keep track of your cart contents and to understand how visitors interact with our website. These cookies do not store personally identifiable information directly.
                </p>
                <p>
                  You have the option to disable cookies through your browser settings, though this may prevent certain features of our website (like the shopping cart) from functioning properly.
                </p>
              </div>
            </article>

            {/* ARTICLE 05 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-05">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 05</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">05. Data Security</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Your protection</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light space-y-4">
                <p>
                  We take reasonable precautions and follow industry best practices to make sure your personal information is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed.
                </p>
                <div className="p-6 sm:p-8 rounded bg-[#111915] text-[#FAF7F2] border-l-4 border-[#C4A482] space-y-3 shadow-md mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C4A482] font-medium">Secure Transactions</span>
                  </div>
                  <p className="font-mono text-xs sm:text-sm tracking-wide text-[#FAF7F2]/95 leading-relaxed">
                    All payment data is encrypted in accordance with the Payment Card Industry Data Security Standard (PCI-DSS). We do not store your credit card data on our own servers.
                  </p>
                </div>
              </div>
            </article>

            {/* ARTICLE 06 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-06">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 06</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">06. Your Rights</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Control your data</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light">
                <p>
                  You have the right to access, correct, or request the deletion of your personal information at any time. If you wish to update your details or have your account removed from our systems, simply contact us at info@terramensco.com.
                </p>
                <p className="mt-4">
                  We will process your request promptly in accordance with Indian data protection regulations.
                </p>
              </div>
            </article>

          </main>
        </div>
      </div>
      
      {/* AUDIT & COMPLIANCE REGISTRY BAR */}
      <section className="w-full bg-[#F4EFEA] border-y border-[#C4A482]/40 py-8 px-6 lg:px-16 mb-[-80px]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-widest text-[#38403B]">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A3D32]"></span>
            <span className="font-bold text-[#111915]">LAST UPDITED: SEPTEMBER 15, 2026</span>
            <span className="hidden sm:inline text-[#8C6D46]">•</span>
            <span className="hidden sm:inline text-[#6E7771]">TERRA MEN&apos;S CO. INDIA</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="text-[#6E7771]">MADE IN INDIA</span>
            <span className="text-[#8C6D46]">•</span>
            <span className="text-[#6E7771]">100% VEGAN</span>
          </div>
        </div>
      </section>
      
    </div>
  );
}
