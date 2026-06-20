export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  badge?: string
  materials: { name: string; color: string }[]
  description: string
  features: string[]
  isNew?: boolean
  isSale?: boolean
}

export const CATEGORIES = [
  { id: 'all',    label: 'All',    iconName: 'LayoutGrid'       },
  { id: 'sofa',   label: 'Sofas',  iconName: 'Sofa'             },
  { id: 'bed',    label: 'Beds',   iconName: 'BedDouble'        },
  { id: 'dining', label: 'Dining', iconName: 'UtensilsCrossed'  },
  { id: 'office', label: 'Office', iconName: 'Briefcase'        },
  { id: 'decor',  label: 'Decor',  iconName: 'Lamp'             },
]

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Velour Cloud Sofa',
    category: 'sofa',
    price: 2890,
    rating: 4.9,
    reviews: 318,
    badge: 'Best Seller',
    isNew: false,
    materials: [
      { name: 'Ivory', color: '#f5f0e8' },
      { name: 'Charcoal', color: '#3a3a3a' },
      { name: 'Sage', color: '#8a9e8a' },
      { name: 'Terracotta', color: '#c47858' },
    ],
    description: 'Deep-seat comfort wrapped in premium velour. The Cloud Sofa features individually wrapped coil springs and a solid hardwood frame built to last generations.',
    features: ['Hand-stitched cushions', 'Solid oak legs', '8-way hand-tied springs', 'GREENGUARD Gold certified'],
  },
  {
    id: 2,
    name: 'Oslo Platform Bed',
    category: 'bed',
    price: 3450,
    originalPrice: 4100,
    rating: 4.8,
    reviews: 201,
    badge: 'Sale',
    isSale: true,
    materials: [
      { name: 'Walnut', color: '#6b4226' },
      { name: 'Oak', color: '#c49a3a' },
      { name: 'Ebony', color: '#1c1c1c' },
    ],
    description: 'Scandinavian-inspired platform bed with integrated storage drawers and a sculptural solid walnut headboard.',
    features: ['4 under-bed drawers', 'USB-C charging ports', 'Slatted base', 'Queen & King sizes'],
  },
  {
    id: 3,
    name: 'Loft Dining Table',
    category: 'dining',
    price: 1960,
    rating: 4.7,
    reviews: 145,
    isNew: true,
    materials: [
      { name: 'White Oak', color: '#d4b896' },
      { name: 'Black Steel', color: '#2a2a2a' },
      { name: 'Marble', color: '#f0ede6' },
    ],
    description: 'Live-edge white oak top on a hand-forged matte black steel base. Seats 6-8 comfortably.',
    features: ['Live edge top', 'Hand-forged base', 'Extension leaf available', 'Seats 6-8'],
  },
  {
    id: 4,
    name: 'Arc Floor Lamp',
    category: 'decor',
    price: 480,
    rating: 4.6,
    reviews: 89,
    isNew: true,
    materials: [
      { name: 'Brass', color: '#b8932a' },
      { name: 'Matte Black', color: '#1a1a1a' },
      { name: 'Chrome', color: '#c0c0c0' },
    ],
    description: 'An arcing brass statement lamp with a linen shade. Makes every reading nook feel like a gallery.',
    features: ['Dimmer switch', 'E27 bulb compatible', 'Weighted marble base', 'Rotatable shade'],
  },
  {
    id: 5,
    name: 'Executive Home Chair',
    category: 'office',
    price: 1240,
    rating: 4.8,
    reviews: 267,
    badge: 'Top Rated',
    materials: [
      { name: 'Cognac', color: '#a05c2c' },
      { name: 'Black', color: '#1c1c1c' },
      { name: 'Ivory', color: '#f5f0e8' },
    ],
    description: 'Full-grain leather executive chair with lumbar support, tilt-lock mechanism, and an adjustable headrest.',
    features: ['Full-grain leather', 'Adjustable lumbar', 'Height adjustable', 'Tilt-lock'],
  },
  {
    id: 6,
    name: 'Monolith Bookshelf',
    category: 'decor',
    price: 895,
    originalPrice: 1100,
    rating: 4.5,
    reviews: 112,
    isSale: true,
    materials: [
      { name: 'Ash Grey', color: '#a0a0a0' },
      { name: 'Raw Oak', color: '#c49a3a' },
      { name: 'Jet Black', color: '#111' },
    ],
    description: 'A floor-to-ceiling modular shelving unit with adjustable shelves and hidden cable management.',
    features: ['Modular sections', 'Cable management', 'Wall-mounted', 'Weight rated 80kg/shelf'],
  },
  {
    id: 7,
    name: 'Nest Accent Chair',
    category: 'sofa',
    price: 1680,
    rating: 4.9,
    reviews: 193,
    isNew: true,
    materials: [
      { name: 'Warm Sand', color: '#d4b896' },
      { name: 'Deep Blue', color: '#2a3f5f' },
      { name: 'Forest', color: '#3a5a3a' },
    ],
    description: 'Cocoon-shaped accent chair with 360-degree swivel base. The ultimate reading chair.',
    features: ['360-degree swivel', 'High-density foam', 'Removable cover', 'Walnut base'],
  },
  {
    id: 8,
    name: 'Mist Coffee Table',
    category: 'decor',
    price: 720,
    rating: 4.7,
    reviews: 78,
    materials: [
      { name: 'Travertine', color: '#e8ddd0' },
      { name: 'Smoked Glass', color: '#6a7070' },
      { name: 'Brass', color: '#b8932a' },
    ],
    description: 'Travertine stone top on a sculptural brass frame. Pairs with any sofa for an elevated living room.',
    features: ['Natural travertine', 'Brass hairpin legs', 'Non-scratch feet', '120cm x 60cm'],
  },
  {
    id: 9,
    name: 'Haven Sectional',
    category: 'sofa',
    price: 4280,
    rating: 4.9,
    reviews: 87,
    isNew: true,
    materials: [
      { name: 'Stone Grey',  color: '#8c8c8c' },
      { name: 'Warm Oat',   color: '#d4b896' },
      { name: 'Midnight',   color: '#1c2340' },
    ],
    description: 'Generously sized L-shaped sectional with chaise lounge. Deep-seat comfort with modular, rearrangeable sections.',
    features: ['Modular configuration', 'Deep-seat cushions', 'Removable covers', 'Solid beech frame'],
  },
  {
    id: 10,
    name: 'Porto Dining Chair',
    category: 'chair',
    price: 640,
    rating: 4.7,
    reviews: 134,
    isNew: true,
    materials: [
      { name: 'Woven Rush', color: '#c4a878' },
      { name: 'Velvet Blue', color: '#3a4f7a' },
      { name: 'Blush',       color: '#e8b4a0' },
    ],
    description: 'Handwoven rush seat on a solid beech frame. Stackable and elegant for any dining setting.',
    features: ['Handwoven seat', 'Stackable', 'Solid beech', 'Multiple finishes'],
  },
  {
    id: 11,
    name: 'Zephyr Side Table',
    category: 'decor',
    price: 380,
    rating: 4.6,
    reviews: 56,
    isNew: true,
    materials: [
      { name: 'Terrazzo',   color: '#d4cfc8' },
      { name: 'Onyx',       color: '#2a2a2a' },
      { name: 'Rose Marble', color: '#e8d0c8' },
    ],
    description: 'Sculptural side table with a terrazzo top and slender powder-coated steel legs. Statement piece.',
    features: ['Terrazzo top', 'Powder-coated legs', 'Scratch-resistant', 'Multiple sizes'],
  },
  {
    id: 12,
    name: 'Atelier Storage Cabinet',
    category: 'storage',
    price: 1840,
    rating: 4.8,
    reviews: 42,
    isNew: true,
    materials: [
      { name: 'Natural Oak', color: '#c49a3a' },
      { name: 'Linen White', color: '#f0ede6' },
      { name: 'Smoked Ash',  color: '#7a7268' },
    ],
    description: 'Elegant storage cabinet with hand-woven cane doors and adjustable interior shelving.',
    features: ['Cane-weave doors', 'Adjustable shelves', 'Soft-close hinges', 'Anti-tip wall fixing'],
  },
  {
    id: 13,
    name: 'Aura Writing Desk',
    category: 'office',
    price: 1560,
    rating: 4.8,
    reviews: 93,
    isNew: true,
    materials: [
      { name: 'Walnut',     color: '#6b4226' },
      { name: 'White Oak',  color: '#d4b896' },
      { name: 'Slate',      color: '#5a6070' },
    ],
    description: 'Minimalist writing desk with integrated cable management and a slim hidden drawer.',
    features: ['Cable management', 'Hidden drawer', 'Solid wood top', 'Adjustable feet'],
  },
  {
    id: 14,
    name: 'Solis Pendant Light',
    category: 'decor',
    price: 560,
    rating: 4.7,
    reviews: 71,
    isNew: true,
    materials: [
      { name: 'Spun Brass',  color: '#b8932a' },
      { name: 'Porcelain',   color: '#f0ede6' },
      { name: 'Graphite',    color: '#3a3a3a' },
    ],
    description: 'Hand-spun brass pendant with a sculptural ribbed form. Casts warm, intimate pools of light.',
    features: ['Hand-spun brass', 'E27 compatible', 'Adjustable height', 'Dimmable'],
  },
  {
    id: 15,
    name: 'Float Lounge Chair',
    category: 'chair',
    price: 2120,
    rating: 4.9,
    reviews: 158,
    isNew: true,
    badge: 'Best Seller',
    materials: [
      { name: 'Camel Leather', color: '#a07040' },
      { name: 'Ivory Boucle',  color: '#f0ebe3' },
      { name: 'Forest Velvet', color: '#3a5a4a' },
    ],
    description: 'A timeless lounge chair inspired by mid-century design. Full-grain leather with a solid walnut base.',
    features: ['Full-grain leather', 'Walnut base', 'Down-blend cushions', 'Swivel option'],
  },
  {
    id: 16,
    name: 'Forma Media Unit',
    category: 'storage',
    price: 2240,
    rating: 4.6,
    reviews: 38,
    isNew: true,
    materials: [
      { name: 'Dark Walnut', color: '#4a2e18' },
      { name: 'Matte White', color: '#f5f4f2' },
      { name: 'Washed Oak',  color: '#c8b090' },
    ],
    description: 'Floating media unit with push-to-open drawers and integrated cable ports for a clean, wire-free setup.',
    features: ['Push-to-open', 'Cable ports', 'Wall-mounted', 'Soft-close drawers'],
  },
]

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return PRODUCTS
  return PRODUCTS.filter((p) => p.category === category)
}
