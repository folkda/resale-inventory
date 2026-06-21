'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Send } from 'lucide-react'

const CONTACT_EMAIL = 'KB0RHE@yahoo.com'
const CONTACT_PHONE = '7312900653'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Inquiry from ${name || 'the shop'}`)
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ''}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-ink px-4 md:px-8 py-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-ink-light hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Back to listings
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Get in Touch</h1>
        <p className="text-ink-muted text-sm mb-8">
          Questions about an item, want to make an offer, or arrange pickup? Send a message below.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-surface-border hover:border-brand-300 transition-colors text-sm font-medium text-ink flex-1">
            <Mail size={16} className="text-brand-600" />
            {CONTACT_EMAIL}
          </a>
          <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-surface-border hover:border-brand-300 transition-colors text-sm font-medium text-ink flex-1">
            <Phone size={16} className="text-brand-600" />
            {CONTACT_PHONE}
          </a>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 md:p-6 space-y-4">
          <div>
            <label className="label">Your Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" required />
          </div>
          <div>
            <label className="label">Your Email</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              className="input min-h-32 resize-y"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="I'm interested in the vintage mason jar — is it still available?"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            <Send size={16} />
            Send Message
          </button>
          <p className="text-xs text-ink-light text-center">
            This opens your email app with the message pre-filled — just hit send.
          </p>
        </form>
      </main>
    </div>
  )
}
