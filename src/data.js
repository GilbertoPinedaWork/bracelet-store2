export const MATERIALS = [
  { id: 'gold', label: 'Gold', color: '#cfa968', price: 70 },
  { id: 'silver', label: 'Silver', color: '#c9c6c6', price: 45 },
  { id: 'rose-gold', label: 'Rose gold', color: '#d9a49c', price: 65 },
  { id: 'leather', label: 'Leather', color: '#7a5547', price: 35 },
  { id: 'onyx', label: 'Onyx', color: '#3b3436', price: 40 },
  { id: 'wood', label: 'Wood', color: '#b58f6e', price: 30 },
]

export const STYLES = [
  { id: 'chain', label: 'Chain', price: 0 },
  { id: 'beaded', label: 'Beaded', price: 5 },
  { id: 'cuff', label: 'Cuff', price: 15 },
  { id: 'braided', label: 'Braided', price: 10 },
]

export const SIZES = ['S', 'M', 'L', 'XL']

export const CHARMS = [
  { id: 'none', label: 'No charm', price: 0 },
  { id: 'initial', label: 'Initial', price: 12 },
  { id: 'star', label: 'Star', price: 10 },
  { id: 'moon', label: 'Moon', price: 10 },
]

// gender: 'men' | 'women' | 'unisex' (unisex shows in both sections)
export const PRODUCTS = [
  { id: 1, name: 'Harbor Chain', gender: 'men', material: 'silver', style: 'chain', price: 58 },
  { id: 2, name: 'Cask Cuff', gender: 'men', material: 'leather', style: 'cuff', price: 49 },
  { id: 3, name: 'Basalt Beads', gender: 'men', material: 'onyx', style: 'beaded', price: 44 },
  { id: 4, name: 'Driftwood Braid', gender: 'men', material: 'wood', style: 'braided', price: 38 },
  { id: 5, name: 'Solstice Chain', gender: 'women', material: 'gold', style: 'chain', price: 92 },
  { id: 6, name: 'Blush Beaded', gender: 'women', material: 'rose-gold', style: 'beaded', price: 78 },
  { id: 7, name: 'Petal Cuff', gender: 'women', material: 'rose-gold', style: 'cuff', price: 88 },
  { id: 8, name: 'Moonlit Braid', gender: 'women', material: 'silver', style: 'braided', price: 54 },
  { id: 9, name: 'Tern Cuff', gender: 'unisex', material: 'gold', style: 'cuff', price: 96 },
  { id: 10, name: 'Slate Braid', gender: 'unisex', material: 'leather', style: 'braided', price: 42 },
  { id: 11, name: 'Grove Beads', gender: 'unisex', material: 'wood', style: 'beaded', price: 36 },
  { id: 12, name: 'Night Tide Chain', gender: 'unisex', material: 'onyx', style: 'chain', price: 52 },
]

export const money = (n) => `$${n.toFixed(2)}`
