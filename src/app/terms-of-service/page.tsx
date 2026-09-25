import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { TermsScrollspy } from './components/TermsScrollspy';

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Terra Men's Co. Understand your rights, our product policies, billing, medical disclaimers, and how we govern our platform.",
  alternates: {
    canonical: '/terms-of-service',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | TERRA MEN'S CO.",
    description:
      "Understand your rights and our policies. Terra Men's Co. Terms of Service — transparent, fair, and straightforward.",
    url: 'https://www.terramensco.com/terms-of-service',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "TERRA MEN'S CO. Terms of Service",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terramensco',
    title: "Terms of Service | TERRA MEN'S CO.",
    description:
      "Understand your rights and our policies. Terra Men's Co. Terms of Service.",
    images: ['/images/og/og-image.jpeg'],
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#FAF7F2] font-sans text-[#111915] antialiased selection:bg-[#C4A482]/25 selection:text-[#111915] relative pb-20">
      
      {/* TOP GAZETTE UTILITY / TICKER STRIP */}
      <aside className="w-full bg-[#111915] text-[#FAF7F2] text-[11px] font-mono tracking-widest uppercase py-2 px-6 lg:px-16 border-b border-[#C4A482]/20">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2 text-[#C4A482]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A482] animate-pulse"></span>
              TERRA MEN&apos;S CO. TERMS & CONDITIONS
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
              <span className="text-[#8C6D46] font-medium">TERMS OF SERVICE</span>
              <span className="hidden sm:inline">• EDITION 2.4.0 (INDIA)</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2A3D32]/10 text-[#2A3D32] border border-[#2A3D32]/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A3D32]"></span>
                TERMS & CONDITIONS
              </span>
              <span className="hidden md:inline text-[#111915]/70">APPLICABLE IN INDIA</span>
            </div>
          </div>
          
          {/* Main Headline & Subtitle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.3em] font-medium">Legal Information & Policies</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111915] leading-[1.08] tracking-tight">
                Terms of <span className="italic font-serif font-normal text-[#8C6D46]">Service.</span>
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
                Welcome to Terra Men&apos;s Co. By accessing our website or purchasing our products, you agree to be bound by these terms. We believe in keeping things simple and transparent.
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
                <span className="font-mono text-[10px] text-[#8C6D46]">09 SECTIONS</span>
              </div>
              <p className="font-sans text-xs text-[#6E7771] leading-relaxed">
                Click a section below to read the corresponding terms.
              </p>
              
              <TermsScrollspy />
              
            </div>
            
            {/* Official Dispensary Contact & Download Card */}
            <div className="p-6 rounded bg-[#111915] text-[#FAF7F2] border border-[#C4A482]/30 space-y-4">
              <div className="flex items-center space-x-2 text-[#C4A482]">
                <span className="font-mono text-xs uppercase tracking-widest font-medium">Legal Contact</span>
              </div>
              <p className="font-sans text-xs text-[#FAF7F2]/80 leading-relaxed">
                If you have any questions regarding these terms, please contact our legal team:
                <a className="font-mono text-[#C4A482] underline underline-offset-4 hover:text-[#FAF7F2] transition-colors block mt-1" href="mailto:info@terramensco.com">info@terramensco.com</a>
              </p>
              <div className="pt-2">
                <a className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#C4A482]/15 hover:bg-[#C4A482]/25 text-[#C4A482] text-xs font-mono uppercase tracking-widest border border-[#C4A482]/40 rounded transition-colors" href="#ratification">
                  <span>Download PDF Version</span>
                </a>
              </div>
            </div>
            
            {/* Indian Jurisdiction Notice */}
            <div className="p-5 rounded border border-dashed border-[#C4A482]/50 bg-[#F4EFEA]/70 font-mono text-[10px] space-y-2">
              <div className="flex justify-between text-[#6E7771] uppercase tracking-widest">
                <span>Governing Law</span>
                <span className="text-[#2A3D32] font-semibold">INDIA</span>
              </div>
              <div className="text-[#111915] font-mono text-[11px] bg-[#FAF7F2]/80 p-2 border border-[#C4A482]/20 rounded">
                Governed by the Information Technology Act, 2000 & Consumer Protection Act (India)
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
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">01. General Conditions</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Rules of engagement</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed space-y-4 font-light">
                <p>
                  We reserve the right to refuse service to anyone for any reason at any time.
                </p>
                <p>
                  You understand that your information (excluding credit card information), may be transferred unencrypted over various networks. We use secure gateways for all payment processing.
                </p>
              </div>
            </article>

            {/* ARTICLE 02 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-8" id="article-02">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 02</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">02. Products & Pricing</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Our offerings</p>
              </div>
              
              <div className="relative py-8 px-6 sm:px-10 my-4 bg-[#F4EFEA] border-y-2 border-[#C4A482]/60">
                <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#111915] block leading-snug">
                  &quot;Quality comes first.&quot;
                </span>
              </div>
              
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed space-y-4 font-light">
                <p>
                  Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                </p>
                <p>
                  We have made every effort to display the colors and images of our products as accurately as possible. Slight natural variations may occur.
                </p>
              </div>
            </article>

            {/* ARTICLE 03 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-03">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#C4A482] text-[#111915] uppercase tracking-widest font-semibold">Article 03 • Disclaimer</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">03. Medical Disclaimer</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Health & safety</p>
              </div>
              
              <div className="p-6 sm:p-8 rounded bg-[#F5EFE6] border-2 border-[#C4A482]/50 relative shadow-sm" id="article-disclaimer">
                <div className="flex items-center space-x-3 mb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8C6D46] block font-semibold">HEALTH ADVISORY</span>
                    <span className="font-serif text-lg text-[#111915] font-medium">General Health Guidance</span>
                  </div>
                </div>
                <p className="font-sans text-base sm:text-lg text-[#111915]/90 leading-relaxed font-light mb-6">
                  Disclaimer: Our products are for external use only. Please review the ingredients for allergens and do a patch test before full use. If irritation occurs, consult a doctor.
                </p>
              </div>
            </article>

            {/* ARTICLE 04 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-04">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 04</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">04. Shipping & Delivery</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Logistics timelines</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light space-y-4">
                <p>
                  We aim to dispatch all orders within 1-2 business days from our fulfillment centers in India. Standard delivery typically takes 3-5 business days depending on your location.
                </p>
                <p>
                  Shipping costs are calculated at checkout. If your delivery is significantly delayed, please contact us at info@terramensco.com. We are not responsible for delays caused by the courier service or unforeseen logistical issues.
                </p>
              </div>
            </article>

            {/* ARTICLE 05 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-05">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 05</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">05. Returns & Refunds</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Customer guarantee</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light space-y-4">
                <p>
                  We offer a 7-day return policy for unopened and unused products in their original packaging. Due to hygiene and safety reasons, we cannot accept returns on opened cosmetics or grooming products.
                </p>
                <p>
                  If you receive a defective or damaged product, please notify us within 48 hours of delivery with photographic evidence. We will arrange a replacement or process a full refund to your original payment method. Cancellations are only accepted before the order has been dispatched.
                </p>
              </div>
            </article>

            {/* ARTICLE 06 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-06">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 06</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">06. Billing & Errors</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Transaction integrity</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light space-y-4">
                <p>
                  You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
                </p>
                <div className="p-6 sm:p-8 rounded bg-[#111915] text-[#FAF7F2] border-l-4 border-[#C4A482] space-y-3 shadow-md mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C4A482] font-medium">Pricing & Reseller Notice</span>
                  </div>
                  <p className="font-mono text-xs sm:text-sm tracking-wide text-[#FAF7F2]/95 leading-relaxed">
                    NOTICE: We reserve the right to cancel orders that appear to be placed by unauthorized resellers or distributors. Additionally, we reserve the right to cancel any orders resulting from typographical pricing errors or glitches on the website.
                  </p>
                </div>
              </div>
            </article>

            {/* ARTICLE 07 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-07">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 07</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">07. Limitation of Liability</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Legal protection</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light">
                <p className="uppercase text-sm tracking-wide font-medium">
                  IN NO CASE SHALL TERRA MEN&apos;S CO., OUR DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, INTERNS, SUPPLIERS, SERVICE PROVIDERS OR LICENSORS BE LIABLE FOR ANY INJURY, LOSS, CLAIM, OR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND.
                </p>
                <p className="mt-4">
                  Our maximum liability, arising from any product sold or service provided, shall be strictly limited to the amount you paid for the product or service in question.
                </p>
              </div>
            </article>

            {/* ARTICLE 08 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-08">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 08</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">08. Privacy Policy</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Data protection</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed font-light">
                <p>
                  Your submission of personal information is governed by our Privacy Policy, in compliance with Indian data protection laws.
                </p>
              </div>
              
              <div className="p-6 sm:p-8 rounded bg-[#F4EFEA] border border-[#C4A482]/45 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-[#8C6D46] uppercase tracking-[0.25em] font-semibold">PRIVACY COMMITMENT</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#111915] font-normal">Your Data is Safe</h3>
                </div>
                <Link href="/privacy-policy" className="inline-flex items-center justify-center space-x-3 px-6 py-3.5 bg-[#111915] hover:bg-[#2A3D32] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest rounded transition-colors group shadow-sm flex-shrink-0">
                  <span>Review Privacy Policy</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </article>

            {/* ARTICLE 09 */}
            <article className="scroll-mt-32 pt-10 border-t border-[#C4A482]/35 space-y-6" id="article-09">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-[#111915] text-[#FAF7F2] uppercase tracking-widest font-medium">Article 09</span>
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#111915] tracking-tight">09. Modifications</h2>
                <p className="font-mono text-xs text-[#8C6D46] uppercase tracking-[0.25em]">Policy updates</p>
              </div>
              <div className="font-sans text-base sm:text-lg text-[#38403B] leading-relaxed space-y-4 font-light">
                <p>
                  You can review the most current version of the Terms of Service at any time on this page.
                </p>
                <p>
                  We reserve the right to update, change or replace any part of these Terms by posting updates to our website.
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
