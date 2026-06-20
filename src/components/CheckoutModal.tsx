import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, CreditCard, Lock, ArrowRight, ArrowLeft, Sofa, BedDouble, UtensilsCrossed, Briefcase, Lamp, ShoppingBag } from 'lucide-react'
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
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name:'', email:'', address:'', city:'', zip:'', country:'', card:'', expiry:'', cvv:'' })

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
          <motion.div key="co-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[920] bg-[#1a1a1a]/60 backdrop-blur-lg"
            onClick={step < 3 ? onClose : undefined}
          />

          <motion.div key="co-modal"
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-4 lg:inset-16 xl:inset-24 z-[930] rounded-3xl overflow-hidden flex flex-col lg:flex-row bg-[#faf8f5] shadow-[0_40px_100px_rgba(0,0,0,0.3)]"
            style={{ maxHeight: '90vh' }}
          >
            {/* Left: Order summary */}
            <div className="lg:w-2/5 flex-shrink-0 flex flex-col p-8 lg:p-10 overflow-y-auto bg-[#1a1a1a] relative">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 20%, #8b6914 0%, transparent 60%)' }} />
              <div className="relative z-10">
                <p className="text-white text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>LUMINA</p>
                <p className="text-[11px] uppercase tracking-widest mb-8 text-white/40">Order Summary</p>

                <div className="space-y-4 mb-8">
                  {items.map((item) => (
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
                      <span className="text-sm text-white font-medium flex-shrink-0">${(item.product.price * item.qty).toLocaleString()}</span>
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

            {/* Right: Steps */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Progress */}
              <div className="px-8 pt-8 pb-6 border-b border-black/10">
                <div className="flex items-center gap-2">
                  {STEPS.slice(0, 3).map((s, i) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div className={`progress-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                        <div className="dot">{i < step ? <Check size={11} /> : i + 1}</div>
                        <span className="hidden sm:inline">{s}</span>
                      </div>
                      {i < 2 && <div className="flex-1 h-px" style={{ background: i < step ? '#8b6914' : 'rgba(44,44,44,0.1)' }} />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                  {step === 3 ? (
                    <motion.div key="success"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center gap-6 py-12"
                    >
                      <motion.div animate={{ scale: [0.8, 1.15, 1] }} transition={{ duration: 0.6 }}
                        className="w-20 h-20 rounded-full flex items-center justify-center bg-[#f0f7f0] text-[#5a9a5a]">
                        <Check size={36} />
                      </motion.div>
                      <h3 className="text-2xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>Order Confirmed!</h3>
                      <p className="text-[#6b6b6b]">Thank you for your order. You'll receive a confirmation email shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.div key={step}
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step === 0 && <CartReview items={items} />}
                      {step === 1 && <ShippingForm form={form} onChange={handleField} />}
                      {step === 2 && <PaymentForm form={form} onChange={handleField} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {step < 3 && (
                <div className="px-8 pb-8 pt-4 border-t border-black/10 flex justify-between items-center">
                  <button onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
                    className="flex items-center gap-2 text-sm font-medium text-[#6b6b6b] hover:text-[#2c2c2c] transition-colors">
                    <ArrowLeft size={14} />{step === 0 ? 'Back to Cart' : 'Back'}
                  </button>
                  <button onClick={handleNext}
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-[#2c2c2c] text-white text-[13px] font-medium tracking-widest uppercase rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <span>{step === 2 ? 'Place Order' : 'Continue'}</span>
                    {step === 2 ? <CreditCard size={15} /> : <ArrowRight size={15} />}
                  </button>
                </div>
              )}
            </div>

            {step < 3 && (
              <button onClick={onClose}
                className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.08] text-[#2c2c2c] hover:bg-black/[0.14] transition-colors"
                aria-label="Close checkout"><X size={16} /></button>
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
      <h3 className="text-xl font-semibold mb-6 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>Review Your Order</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl bg-[#f0ebe3]">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-white">
              <CategoryIcon category={item.product.category} size={22} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-[#1a1a1a]">{item.product.name}</p>
              <p className="text-xs mt-0.5 text-[#6b6b6b]">{item.material} · Qty {item.qty}</p>
            </div>
            <span className="font-semibold text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
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

function Field({ label, k, placeholder, form, onChange }: { label:string; k: keyof FormState; placeholder?: string; form: FormState; onChange: OnChange }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block text-[#6b6b6b]">{label}</label>
      <input type="text" value={form[k]} onChange={onChange(k)} placeholder={placeholder}
        className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm outline-none text-[#2c2c2c] bg-white focus:border-[#8b6914] transition-colors" />
    </div>
  )
}

function ShippingForm({ form, onChange }: { form: FormState; onChange: OnChange }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>Shipping Details</h3>
      <div className="space-y-4">
        <Field label="Full Name" k="name" placeholder="Jane Smith" form={form} onChange={onChange} />
        <Field label="Email" k="email" placeholder="jane@example.com" form={form} onChange={onChange} />
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
      <h3 className="text-xl font-semibold mb-2 text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>Payment</h3>
      <div className="flex items-center gap-2 mb-6">
        <Lock size={12} className="text-[#8b6914]" />
        <span className="text-xs text-[#6b6b6b]">Your payment info is encrypted and never stored</span>
      </div>
      <div className="space-y-4">
        <Field label="Cardholder Name" k="name" placeholder="Jane Smith" form={form} onChange={onChange} />
        <Field label="Card Number" k="card" placeholder="4242 4242 4242 4242" form={form} onChange={onChange} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" k="expiry" placeholder="MM / YY" form={form} onChange={onChange} />
          <Field label="CVV" k="cvv" placeholder="123" form={form} onChange={onChange} />
        </div>
      </div>
      <div className="mt-6 p-4 rounded-2xl flex items-center gap-3 bg-[#f0ebe3]">
        <CreditCard size={18} className="text-[#8b6914]" />
        <p className="text-xs text-[#6b6b6b] leading-relaxed">Demo mode — no real charges. Use any test card details.</p>
      </div>
    </div>
  )
}
