import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Mail,
  Clock,
  MessageCircle,
  Truck,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ContactWhatsAppForm } from './components/ContactWhatsAppForm';

export const metadata: Metadata = {
  title: "Contact Us | TERRA MEN'S CO.",
  description:
    "Get in touch with Terra Men's Co. customer support. Reach out via WhatsApp or email for help with your orders, products, and questions.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contact Us | TERRA MEN'S CO.",
    description:
      "Get in touch with Terra Men's Co. customer support. Available Monday to Friday, 10:00 AM to 5:00 PM.",
    url: 'https://www.terramensco.com/contact',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "TERRA MEN'S CO. Contact Us",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terramensco',
    title: "Contact Us | TERRA MEN'S CO.",
    description:
      "Get in touch with Terra Men's Co. customer support. Available Monday to Friday, 10:00 AM to 5:00 PM.",
    images: ['/images/og/og-image.jpeg'],
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAF7F2] font-sans text-[#111915] antialiased selection:bg-[#C4A482]/25 selection:text-[#111915] pb-24">
      {/* TOP STRIP */}
      <aside className="w-full bg-[#111915] text-[#FAF7F2] text-[11px] font-mono tracking-widest uppercase py-2.5 px-6 lg:px-16 border-b border-[#C4A482]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-2 text-[#C4A482]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A482] animate-pulse" />
              CUSTOMER SUPPORT
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline text-[#FAF7F2]/70">ALL INDIA DELIVERY & SUPPORT</span>
          </div>
          <div className="flex items-center space-x-6 text-[#FAF7F2]/70 text-[10px]">
            <span>HOURS: 10:00 AM – 5:00 PM</span>
            <span className="text-white/30">•</span>
            <span>MON – FRI</span>
          </div>
        </div>
      </aside>

      {/* HERO SECTION */}
      <section className="relative pt-14 pb-10 sm:pt-16 sm:pb-12 border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2D4438]/10 rounded-full border border-[#2D4438]/20">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#2D4438] font-semibold">
                Help & Support
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#181817] font-normal tracking-tight">
              Contact Us
            </h1>

            <p className="text-sm sm:text-base text-[#55524D] leading-relaxed font-light max-w-2xl pt-1">
              Have a question about your order, our products, or need help? Reach out to us through WhatsApp or email and we will be happy to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: CONTACT CARDS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD 1: WORKING HOURS */}
            <div className="bg-white rounded-3xl border border-[#E8E2D7] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#2D4438]/10 text-[#2D4438] flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#77736C] font-semibold block">
                    Schedule
                  </span>
                  <h3 className="font-serif text-xl text-[#181817]">Working Hours</h3>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
                  <span className="text-[#55524D] font-medium">Monday – Friday</span>
                  <span className="font-mono font-semibold text-[#181817] bg-[#FAF7F2] px-2.5 py-1 rounded-md">
                    10:00 AM – 5:00 PM
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#55524D]">Saturday & Sunday</span>
                  <span className="text-[#77736C] text-xs">Closed</span>
                </div>
              </div>

              <div className="mt-5 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7] text-[11px] text-[#55524D] flex items-start gap-2.5 leading-relaxed">
                <ShieldCheck size={16} className="text-[#2D4438] shrink-0 mt-0.5" />
                <span>Messages received outside working hours will be answered on the next business day.</span>
              </div>
            </div>

            {/* CARD 2: EMAIL SUPPORT */}
            <div className="bg-white rounded-3xl border border-[#E8E2D7] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#2D4438]/10 text-[#2D4438] flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#77736C] font-semibold block">
                    Email Support
                  </span>
                  <h3 className="font-serif text-xl text-[#181817]">Email Us</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#55524D] font-light leading-relaxed mb-4">
                For order questions, invoices, or general support:
              </p>

              <a
                href="mailto:info@terramensco.com"
                className="inline-flex items-center gap-2 font-mono text-sm sm:text-base font-semibold text-[#2D4438] hover:text-[#181817] hover:underline underline-offset-4 transition-colors"
              >
                <span>info@terramensco.com</span>
                <ArrowRight size={14} />
              </a>

              <p className="text-[11px] text-[#77736C] mt-2 font-light">
                We usually reply within 24 hours.
              </p>
            </div>

            {/* CARD 3: WHATSAPP DIRECT CHAT */}
            <div className="bg-[#111915] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2D4438] text-white flex items-center justify-center shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C4A482] font-semibold block">
                    Quick Support
                  </span>
                  <h3 className="font-serif text-xl text-white">WhatsApp Chat</h3>
                </div>
              </div>

              <p className="text-xs text-[#DDD8CF] font-light leading-relaxed mb-6">
                Chat with our team directly on WhatsApp for quick help with your order or questions.
              </p>

              <a
                href="https://wa.me/917404145998?text=Hello%2C%20I%20have%20a%20question%20regarding%20Terra%20Men%27s%20Co."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-white text-[#111915] hover:bg-[#C4A482] hover:text-white rounded-xl text-xs font-mono uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer"
              >
                <span>Open WhatsApp Chat</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: WHATSAPP FORM (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <ContactWhatsAppForm />

            {/* QUICK LINKS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/account"
                className="group bg-white rounded-2xl border border-[#E8E2D7] p-5 hover:border-[#2D4438] transition-all flex items-start gap-3.5 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#2D4438] group-hover:bg-[#2D4438] group-hover:text-white transition-colors">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#181817] flex items-center gap-1 group-hover:text-[#2D4438] transition-colors">
                    <span>Track Your Order</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </h4>
                  <p className="text-[11px] text-[#77736C] mt-1 leading-snug">
                    Check the live status and shipping updates for your order.
                  </p>
                </div>
              </Link>

              <Link
                href="/about#faq"
                className="group bg-white rounded-2xl border border-[#E8E2D7] p-5 hover:border-[#2D4438] transition-all flex items-start gap-3.5 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#2D4438] group-hover:bg-[#2D4438] group-hover:text-white transition-colors">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#181817] flex items-center gap-1 group-hover:text-[#2D4438] transition-colors">
                    <span>FAQs & Help</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </h4>
                  <p className="text-[11px] text-[#77736C] mt-1 leading-snug">
                    Quick answers to common questions about products and shipping.
                  </p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
