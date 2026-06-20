import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const REVIEWS = [
  {
    id: 1,
    name: 'Sofia Andersen',
    location: 'Copenhagen, DK',
    avatar: 'SA',
    color: '#c49a3a',
    rating: 5,
    product: 'Velour Cloud Sofa',
    text: 'I was skeptical ordering a sofa online, but LUMINA made it effortless. The White Glove delivery team assembled everything and it looks even better than the photos. This sofa is the centrepiece of our living room now.',
  },
  {
    id: 2,
    name: 'Marcus Webb',
    location: 'New York, US',
    avatar: 'MW',
    color: '#5a80c8',
    rating: 5,
    product: 'Oslo Platform Bed',
    text: 'The Oslo Bed is everything I wanted — minimal, sturdy, and incredibly well-made. The walnut finish is stunning. Three months in and I\'m still stopping to admire it every morning.',
  },
  {
    id: 3,
    name: 'Priya Nair',
    location: 'London, UK',
    avatar: 'PN',
    color: '#9a5aaa',
    rating: 5,
    product: 'Loft Dining Table',
    text: 'We host dinner parties often and this table is an absolute conversation starter. Solid as a rock, beautiful live edge, and the steel base is immaculate. Worth every penny.',
  },
  {
    id: 4,
    name: 'Tomás Reyes',
    location: 'Barcelona, ES',
    avatar: 'TR',
    color: '#c4605a',
    rating: 5,
    product: 'Nest Accent Chair',
    text: 'I bought the Nest chair for my home office corner. The 360° swivel is smooth, the foam is dense and supportive, and the sand fabric is soft to the touch. A design masterpiece.',
  },
  {
    id: 5,
    name: 'Yuki Tanaka',
    location: 'Tokyo, JP',
    avatar: 'YT',
    color: '#5a9a5a',
    rating: 5,
    product: 'Mist Coffee Table',
    text: 'The travertine top arrived perfectly packaged and the brass legs were easy to attach. The table feels luxurious and looks incredible in our minimalist apartment. Exceeded expectations.',
  },
]

export default function Testimonials() {
  const [index, setIndex]   = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef         = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length)
    }, 5000)
  }

  useEffect(() => {
    if (!paused) startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused])

  const prev = () => { setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length); setPaused(true) }
  const next = () => { setIndex((i) => (i + 1) % REVIEWS.length); setPaused(true) }

  const review = REVIEWS[index]

  return (
    <section className="py-24 lg:py-32" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Customer Stories</p>
          <h2 className="section-title">
            Loved by <span className="gradient-text">50,000+</span><br />
            Homeowners
          </h2>
        </motion.div>

        {/* Main Review Card */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative rounded-3xl p-10 lg:p-14 bg-white text-center"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              {/* Quote icon */}
              <div className="absolute top-8 left-8 opacity-10">
                <Quote size={48} style={{ color: 'var(--color-charcoal)' }} />
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={18} className="star-filled" fill="currentColor" />
                ))}
              </div>

              {/* Text */}
              <blockquote
                className="font-serif text-xl lg:text-2xl font-medium leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-dark)' }}
              >
                "{review.text}"
              </blockquote>

              {/* Product */}
              <p className="section-label mb-6">Re: {review.product}</p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                  style={{ background: review.color }}
                >
                  {review.avatar}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm" style={{ color: 'var(--color-dark)' }}>{review.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{review.location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border flex items-center justify-center transition-all hover:shadow-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-charcoal)' }}
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setIndex(i); setPaused(true) }}
                  aria-label={`Go to review ${i + 1}`}
                  style={{
                    width: i === index ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === index ? 'var(--color-wood)' : 'var(--color-sand)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full border flex items-center justify-center transition-all hover:shadow-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-charcoal)' }}
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mini review grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-14">
          {REVIEWS.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => { setIndex(i); setPaused(true) }}
              className="rounded-2xl p-4 text-left transition-all"
              style={{
                background: i === index ? 'var(--color-charcoal)' : 'white',
                boxShadow: 'var(--shadow-sm)',
                color: i === index ? 'white' : 'var(--color-charcoal)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: r.color }}
                >
                  {r.avatar}
                </div>
                <span className="text-xs font-medium truncate">{r.name.split(' ')[0]}</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={9} fill={i === index ? '#c49a3a' : '#c49a3a'} style={{ color: '#c49a3a' }} />
                ))}
              </div>
            </motion.button>
          ))}
        </div>

      </div>
    </section>
  )
}
