import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, CreditCard, Lock, ArrowRight, ArrowLeft, Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp, ShoppingBag, ChevronDown } from 'lucide-react'
import type { CartItem } from './CartDrawer'

interface CheckoutModalProps {
  open: boolean
  items: CartItem[]
  onClose: () => void
  onSuccess: () => void
}

const STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirmed']

function CategoryIcon({ category, size = 18 }: { category: string; size?: number }) {
  const map: Record<string, React.ReactNode> = {
    sofa:   <Sofa size={size} />,
    bed:    <BedDouble size={size} />,
    dining: <UtensilsCrossed size={size} />,
    office: <Briefcase size={size} />,
    decor:  <Lamp size={size} />,
  }
  return <span className="text-[#c49a3a]">{map[category] ?? <ShoppingBag size={size} />}</span>
}

export default function CheckoutModal({ open, items, onClose, onSuccess }: CheckoutModalProps) {
  const [step, setStep]           = useState(0)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [form, setForm]           = useState({ name:'', email:'', address:'', city:'', zip:'', country:'', card:'', expiry:'', cvv:'' })

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const shipping = subtotal > 500 ? 0 : 79
  const total    = subtotal + shipping

  const handleField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1)
    else { setStep(3); setTimeout(() => { onSuccess(); onClose(); setStep(0) }, 3000) }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div key="co-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[920] bg-[#1a1a1a]/60 backdrop-blur-lg"
            onClick={step < 3 ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div key="co-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-[930] flex flex-col lg:flex-row bg-[#faf8f5] shadow-[0_40px_100px_rgba(0,0,0,0.3)]
              inset-x-0 bottom-0 top-[5%] rounded-t-3xl
              lg:inset-4 xl:inset-12 lg:rounded-3xl"
            style={{ maxHeight: '95dvh' }}
          >

            {/* ── Left / Top: Order summary ── */}
            <div className="lg:w-2/5 flex-shrink-0 flex flex-col bg-[#1a1a1a] relative
              rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden">

              {/* Gold radial glow */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 20%, #8b6914 0%, transparent 60%)' }} />

              {/* Mobile: compact header row with toggle */}
              <button
                className="lg:hidden relative z-10 flex items-center justify-between w-full px-5 py-4 text-left"
                onClick={() => setSummaryOpen(o => !o)}
              >
                <div>
                  <p className="text-white font-semibold text-base" style={{ fontFamily: 'var(--font-serif)' }}>P&M Craft</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Order Summary</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-serif)' }}>
                    ${total.toLocaleString()}
                  </span>
                  <motion.div animate={{ rotate: summaryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} className="text-white/60" />
                  </motion.div>
                </div>
              </button>

              {/* Mobile: collapsible item list */}
              <AnimatePresence>
                {summaryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="lg:hidden relative z-10 overflow-hidden px-5 pb-4"
                  >
                    <div className="space-y-3 mb-4">
                      {items.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center gap-3">
                          <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.06]">
                              <CategoryIcon category={item.product.category} size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white leading-tight">{item.product.name}</p>
                              <p className="text-[11px] text-white/45">Qty {item.qty}</p>
                            </div>
                          </div>
                          <span className="text-sm text-white font-medium flex-shrink-0">
                            ${(item.product.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-white/30">
                      <Lock size={10} /><span className="text-[10px]">Secured by 256-bit SSL</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop: full order summary */}
              <div className="hidden lg:flex flex-col flex-1 p-10 overflow-y-auto relative z-10">
                <p className="text-white text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>P&M Craft</p>
                <p className="text-[11px] uppercase tracking-widest mb-8 text-white/40">Order Summary</p>

                <div className="space-y-4 mb-8 flex-1">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between items-start gap-3">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.06]">
                          <CategoryIcon category={item.product.category} size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.product.name}</p>
                          <p className="text-xs text-white/45">{item.material} · Qty {item.qty}</p>
                        </div>
                      </div>
                      <span className="text-sm text-white font-medium flex-shrink-0">
                        ${(item.product.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-white/55"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-white/55"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
                  <div className="flex justify-between font-semibold text-lg text-white pt-2">
                    <span>Total</span>
                    <span style={{ fontFamily: 'var(--font-serif)' }}>${total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2 text-white/40">
                  <Lock size={12} /><span className="text-[11px]">Secured by 256-bit SSL encryption</span>
                </div>
              </div>
            </div>

            {/* ── Right: Steps ── */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">

              {/* Progress bar */}
              <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-4 sm:pb-6 border-b border-black/10 flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {STEPS.slice(0, 3).map((s, i) => (
                    <div key={s} className="flex items-center gap-1.5 sm:gap-2 flex-1">
                      <div className={`flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium transition-colors ${
                        i === step ? 'text-[#1a1a1a]' : i < step ? 'text-[#8b6914]' : 'text-[#b0b0b0]'
                      }`}>
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold flex-shrink-0 transition-all ${
                          i === step
                            ? 'bg-[#1a1a1a] text-white'
                            : i < step
                              ? 'bg-[#8b6914] text-white'
                              : 'bg-[#e8ddd0] text-[#9a9a9a]'
                        }`}>
                          {i < step ? <Check size={11} /> : i + 1}
                        </div>
                        <span className="hidden sm:inline whitespace-nowrap">{s}</span>
                      </div>
                      {i < 2 && (
                        <div className="flex-1 h-px mx-1" style={{ background: i < step ? '#8b6914' : 'rgba(44,44,44,0.1)' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-8">
                <AnimatePresence mode="wait">
                  {step === 3 ? (
                    <motion.div key="success"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center gap-5 py-10"
                    >
                      <motion.div animate={{ scale: [0.8, 1.15, 1] }} transition={{ duration: 0.6 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[#f0f7f0] text-[#5a9a5a]">
                        <Check size={30} />
                      </motion.div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>Order Confirmed!</h3>
                      <p className="text-sm text-[#6b6b6b] max-w-xs">Thank you for your order. You'll receive a confirmation email shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.div key={step}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {step === 0 && <CartReview items={items} />}
                      {step === 1 && <ShippingForm form={form} onChange={handleField} />}
                      {step === 2 && <PaymentForm form={form} onChange={handleField} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons — sticky at bottom */}
              {step < 3 && (
                <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-3 sm:pt-4 border-t border-black/10 flex justify-between items-center flex-shrink-0 bg-[#faf8f5]">
                  <button onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
                    className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-[#6b6b6b] hover:text-[#2c2c2c] transition-colors">
                    <ArrowLeft size={14} />
                    <span>{step === 0 ? 'Back to Cart' : 'Back'}</span>
                  </button>
                  <button onClick={handleNext}
                    className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#2c2c2c] text-white text-[12px] sm:text-[13px] font-medium tracking-widest uppercase rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <span>{step === 2 ? 'Place Order' : 'Continue'}</span>
                    {step === 2 ? <CreditCard size={14} /> : <ArrowRight size={14} />}
                  </button>
                </div>
              )}
            </div>

            {/* Close button */}
            {step < 3 && (
              <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/[0.08] text-[#2c2c2c] hover:bg-black/[0.14] transition-colors z-50"
                aria-label="Close checkout">
                <X size={15} />
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CartReview({ items }: { items: CartItem[] }) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
        Review Your Order
      </h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.product.id} className="flex gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#f0ebe3]">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-white">
              <CategoryIcon category={item.product.category} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#1a1a1a] truncate">{item.product.name}</p>
              <p className="text-xs mt-0.5 text-[#6b6b6b]">{item.material} · Qty {item.qty}</p>
            </div>
            <span className="font-semibold text-sm text-[#1a1a1a] flex-shrink-0" style={{ fontFamily: 'var(--font-serif)' }}>
              ${(item.product.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

type FormState = { name:string; email:string; address:string; city:string; zip:string; country:string; card:string; expiry:string; cvv:string }
type OnChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void

function Field({ label, k, placeholder, form, onChange, type = 'text' }: { label:string; k: keyof FormState; placeholder?: string; form: FormState; onChange: OnChange; type?: string }) {
  return (
    <div>
      <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block text-[#6b6b6b]">{label}</label>
      <input type={type} value={form[k]} onChange={onChange(k)} placeholder={placeholder}
        className="w-full border border-black/10 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm outline-none text-[#2c2c2c] bg-white focus:border-[#8b6914] transition-colors"
      />
    </div>
  )
}

function ShippingForm({ form, onChange }: { form: FormState; onChange: OnChange }) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
        Shipping Details
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name" k="name" placeholder="Jane Smith" form={form} onChange={onChange} />
          <Field label="Email" k="email" placeholder="jane@example.com" form={form} onChange={onChange} type="email" />
        </div>
        <Field label="Street Address" k="address" placeholder="123 Main Street" form={form} onChange={onChange} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" k="city" placeholder="New York" form={form} onChange={onChange} />
          <Field label="ZIP Code" k="zip" placeholder="10001" form={form} onChange={onChange} />
        </div>
        <Field label="Country" k="country" placeholder="United States" form={form} onChange={onChange} />
      </div>
    </div>
  )
}

function PaymentForm({ form, onChange }: { form: FormState; onChange: OnChange }) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
        Payment
      </h3>
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Lock size={12} className="text-[#8b6914]" />
        <span className="text-xs text-[#6b6b6b]">Your payment info is encrypted and never stored</span>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <Field label="Cardholder Name" k="name" placeholder="Jane Smith" form={form} onChange={onChange} />
        <Field label="Card Number" k="card" placeholder="4242 4242 4242 4242" form={form} onChange={onChange} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" k="expiry" placeholder="MM / YY" form={form} onChange={onChange} />
          <Field label="CVV" k="cvv" placeholder="123" form={form} onChange={onChange} />
        </div>
      </div>
      <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 bg-[#f0ebe3]">
        <CreditCard size={16} className="text-[#8b6914] flex-shrink-0" />
        <p className="text-xs text-[#6b6b6b] leading-relaxed">Demo mode — no real charges. Use any test card details.</p>
      </div>
    </div>
  )
}
