'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, MessageCircle } from 'lucide-react';

const TOPICS = [
  'Order Status & Tracking',
  'Product Questions',
  'Returns & Exchanges',
  'Payment & Invoice',
  'General Inquiry',
];

export const ContactWhatsAppForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const formattedMessage = [
      `*Terra Men's Co. - Customer Inquiry*`,
      ``,
      `*Name:* ${name.trim()}`,
      email.trim() ? `*Email:* ${email.trim()}` : null,
      orderNumber.trim()
        ? `*Order Number:* ${orderNumber.trim().toUpperCase().startsWith('TR-') ? orderNumber.trim().toUpperCase() : `#${orderNumber.trim()}`}`
        : null,
      `*Topic:* ${topic}`,
      ``,
      `*Message:*`,
      `${message.trim()}`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    // WhatsApp country code for India (91) + target number (7404145998)
    const waUrl = `https://wa.me/917404145998?text=${encodeURIComponent(formattedMessage)}`;
    
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E2D7] p-7 sm:p-10 shadow-xs relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#2D4438] text-white flex items-center justify-center shrink-0 shadow-xs">
          <MessageSquare size={18} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#2D4438] font-bold block">
            Direct Support
          </span>
          <h3 className="font-serif text-2xl text-[#181817]">Send Us a Message</h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#77736C] font-light leading-relaxed mb-8">
        Fill out the form below to chat with our support team directly on WhatsApp. We will help you as quickly as possible.
      </p>

      {submitted ? (
        <div className="bg-[#FAF7F2] border border-[#2D4438]/20 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#2D4438]/10 text-[#2D4438] flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-serif text-lg text-[#181817] font-medium">WhatsApp Opened</h4>
            <p className="text-xs text-[#77736C] mt-1 max-w-sm mx-auto">
              Your message has opened in WhatsApp. Our support team is available Monday to Friday, 10:00 AM to 5:00 PM.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs font-mono uppercase tracking-widest text-[#2D4438] hover:underline cursor-pointer pt-2"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold mb-2">
                Your Name <span className="text-[#DC143C]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#181817] placeholder-[#A5A096] focus:outline-none focus:border-[#2D4438] focus:bg-white transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#181817] placeholder-[#A5A096] focus:outline-none focus:border-[#2D4438] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Topic Selector */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold mb-2">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-white transition-all cursor-pointer"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Number (Optional) */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold mb-2">
                Order Number <span className="text-[#A5A096] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. TR-8K9M2P4X"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#181817] placeholder-[#A5A096] focus:outline-none focus:border-[#2D4438] focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold mb-2">
              Message <span className="text-[#DC143C]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#181817] placeholder-[#A5A096] focus:outline-none focus:border-[#2D4438] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] text-[#77736C]">
              <MessageCircle size={14} className="text-[#2D4438]" />
              <span>Direct WhatsApp Support</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#2D4438] hover:bg-[#181817] text-white rounded-xl text-xs font-mono uppercase tracking-[0.2em] font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <span>Chat on WhatsApp</span>
              <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
