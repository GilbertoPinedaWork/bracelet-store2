import { useMemo, useState } from 'react'
import { MATERIALS, STYLES, SIZES, CHARMS, PRODUCTS, money } from './data.js'

const matOf = (id) => MATERIALS.find((m) => m.id === id)

/* ---------- Bracelet drawing (used for products and the builder) ---------- */
function Bracelet({ color, style, charm = 'none', initial = 'A' }) {
  const n = 22, r = 70
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a), deg: (a * 180) / Math.PI }
  })
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`${style} bracelet`}>
      {style === 'cuff' && <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="16" />}
      {style === 'braided' && (
        <>
          <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="14" strokeDasharray="9 4" />
          <circle cx="100" cy="100" r={r} fill="none" stroke="#0004" strokeWidth="2" strokeDasharray="4 9" />
        </>
      )}
      {style === 'chain' &&
        pts.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx="10" ry="5.5" fill="none" stroke={color} strokeWidth="3"
            transform={`rotate(${p.deg + 90 + (i % 2 ? 90 : 0)} ${p.x} ${p.y})`} />
        ))}
      {style === 'beaded' &&
        pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="8" fill={color} />
            <circle cx={p.x - 2} cy={p.y - 2} r="2.4" fill="#fff6" />
          </g>
        ))}
      {charm !== 'none' && (
        <g transform="translate(100 176)">
          <circle r="13" fill={color} stroke="#fff5" strokeWidth="1.5" />
          <text textAnchor="middle" dy="5" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Cormorant Garamond, serif">
            {charm === 'initial' ? initial : charm === 'star' ? '★' : '☾'}
          </text>
        </g>
      )}
    </svg>
  )
}

/* ---------- Shop sections with filters ---------- */
function Shop({ section, addToBag }) {
  const [q, setQ] = useState('')
  const [mats, setMats] = useState([])
  const [style, setStyle] = useState('all')
  const [max, setMax] = useState(100)
  const [sort, setSort] = useState('featured')

  const toggleMat = (id) => setMats((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
  const reset = () => { setQ(''); setMats([]); setStyle('all'); setMax(100); setSort('featured') }

  const items = useMemo(() => {
    let list = PRODUCTS.filter((p) => section === 'all' || p.gender === section || p.gender === 'unisex')
    const term = q.trim().toLowerCase()
    if (term) list = list.filter((p) => `${p.name} ${matOf(p.material).label} ${p.style}`.toLowerCase().includes(term))
    if (mats.length) list = list.filter((p) => mats.includes(p.material))
    if (style !== 'all') list = list.filter((p) => p.style === style)
    list = list.filter((p) => p.price <= max)
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [section, q, mats, style, max, sort])

  const title = { all: 'All bracelets', men: "Men's bracelets", women: "Women's bracelets" }[section]

  return (
    <section className="shop">
      <h1>{title}</h1>
      <div className="layout">
        <aside className="filters" aria-label="Filters">
          <label className="field">Search
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, material, style" />
          </label>
          <fieldset>
            <legend>Material</legend>
            <div className="chips">
              {MATERIALS.map((m) => (
                <button key={m.id} className={`chip ${mats.includes(m.id) ? 'on' : ''}`} aria-pressed={mats.includes(m.id)} onClick={() => toggleMat(m.id)}>
                  <i style={{ background: m.color }} />{m.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="field">Style
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="all">All styles</option>
              {STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <label className="field">Max price: {money(max)}
            <input type="range" min="30" max="100" step="2" value={max} onChange={(e) => setMax(+e.target.value)} />
          </label>
          <label className="field">Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
          <button className="link" onClick={reset}>Clear filters</button>
        </aside>

        <div>
          <p className="count">{items.length} {items.length === 1 ? 'bracelet' : 'bracelets'}</p>
          {items.length === 0 ? (
            <div className="empty">
              <p>No bracelets match those filters.</p>
              <button className="btn" onClick={reset}>Clear filters</button>
            </div>
          ) : (
            <div className="grid">
              {items.map((p) => {
                const m = matOf(p.material)
                return (
                  <article key={p.id} className="card">
                    <div className="art"><Bracelet color={m.color} style={p.style} /></div>
                    <h3>{p.name}</h3>
                    <p className="meta">{m.label}, {p.style}</p>
                    <div className="row">
                      <strong>{money(p.price)}</strong>
                      <button className="btn small" onClick={() => addToBag({ key: `p${p.id}`, name: p.name, detail: `${m.label}, ${p.style}`, price: p.price })}>Add to bag</button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Build it yourself ---------- */
function Builder({ addToBag }) {
  const [material, setMaterial] = useState('gold')
  const [style, setStyle] = useState('chain')
  const [size, setSize] = useState('M')
  const [charm, setCharm] = useState('none')
  const [initial, setInitial] = useState('A')

  const m = matOf(material)
  const s = STYLES.find((x) => x.id === style)
  const c = CHARMS.find((x) => x.id === charm)
  const total = m.price + s.price + c.price

  const add = () =>
    addToBag({
      key: `custom-${material}-${style}-${size}-${charm}-${charm === 'initial' ? initial : ''}`,
      name: 'Custom bracelet',
      detail: `${m.label}, ${s.label}, size ${size}${charm !== 'none' ? `, ${c.label.toLowerCase()} charm${charm === 'initial' ? ` ${initial}` : ''}` : ''}`,
      price: total,
    })

  return (
    <section className="builder">
      <h1>Build your own</h1>
      <div className="build-layout">
        <div className="preview">
          <Bracelet color={m.color} style={style} charm={charm} initial={initial} />
          <p className="total">{money(total)}</p>
          <button className="btn" onClick={add}>Add to bag</button>
        </div>
        <div className="steps">
          <Step title="Material">
            {MATERIALS.map((x) => (
              <button key={x.id} className={`chip big ${material === x.id ? 'on' : ''}`} aria-pressed={material === x.id} onClick={() => setMaterial(x.id)}>
                <i style={{ background: x.color }} />{x.label}<span>{money(x.price)}</span>
              </button>
            ))}
          </Step>
          <Step title="Style">
            {STYLES.map((x) => (
              <button key={x.id} className={`chip big ${style === x.id ? 'on' : ''}`} aria-pressed={style === x.id} onClick={() => setStyle(x.id)}>
                {x.label}<span>{x.price ? `+${money(x.price)}` : 'Included'}</span>
              </button>
            ))}
          </Step>
          <Step title="Size">
            {SIZES.map((x) => (
              <button key={x} className={`chip big ${size === x ? 'on' : ''}`} aria-pressed={size === x} onClick={() => setSize(x)}>{x}</button>
            ))}
          </Step>
          <Step title="Charm">
            {CHARMS.map((x) => (
              <button key={x.id} className={`chip big ${charm === x.id ? 'on' : ''}`} aria-pressed={charm === x.id} onClick={() => setCharm(x.id)}>
                {x.label}<span>{x.price ? `+${money(x.price)}` : ''}</span>
              </button>
            ))}
            {charm === 'initial' && (
              <label className="field inline">Letter
                <input maxLength={1} value={initial} onChange={(e) => setInitial((e.target.value || 'A').toUpperCase())} />
              </label>
            )}
          </Step>
        </div>
      </div>
    </section>
  )
}

const Step = ({ title, children }) => (
  <fieldset className="step"><legend>{title}</legend><div className="chips">{children}</div></fieldset>
)

/* ---------- Bag drawer ---------- */
function BagDrawer({ bag, setBag, close }) {
  const change = (key, d) =>
    setBag((b) => b.map((i) => (i.key === key ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0))
  const subtotal = bag.reduce((t, i) => t + i.price * i.qty, 0)
  return (
    <>
      <div className="scrim" onClick={close} />
      <aside className="drawer" aria-label="Your bag">
        <header><h2>Your bag</h2><button className="link" onClick={close}>Close</button></header>
        {bag.length === 0 ? (
          <p className="empty-bag">Your bag is empty. Add a bracelet to get started.</p>
        ) : (
          <>
            <ul>
              {bag.map((i) => (
                <li key={i.key}>
                  <div><strong>{i.name}</strong><p className="meta">{i.detail}</p></div>
                  <div className="qty">
                    <button aria-label="Remove one" onClick={() => change(i.key, -1)}>−</button>
                    <span>{i.qty}</span>
                    <button aria-label="Add one" onClick={() => change(i.key, 1)}>+</button>
                  </div>
                  <span>{money(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <footer>
              <div className="row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <button className="btn wide">Checkout</button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

/* ---------- App ---------- */
export default function App() {
  const [view, setView] = useState('all')
  const [bag, setBag] = useState([])
  const [open, setOpen] = useState(false)

  const addToBag = (item) => {
    setBag((b) => (b.some((i) => i.key === item.key) ? b.map((i) => (i.key === item.key ? { ...i, qty: i.qty + 1 } : i)) : [...b, { ...item, qty: 1 }]))
    setOpen(true)
  }
  const count = bag.reduce((t, i) => t + i.qty, 0)
  const nav = [['all', 'Shop all'], ['men', 'Men'], ['women', 'Women'], ['build', 'Build your own']]

  return (
    <>
      <header className="top">
        <button className="logo" onClick={() => setView('all')}>Tidewrist</button>
        <nav>
          {nav.map(([id, label]) => (
            <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}>{label}</button>
          ))}
        </nav>
        <button className="bagbtn" onClick={() => setOpen(true)} aria-label={`Open bag, ${count} items`}>
          Bag <span>{count}</span>
        </button>
      </header>
      <main>
        {view === 'build' ? <Builder addToBag={addToBag} /> : <Shop key={view} section={view} addToBag={addToBag} />}
      </main>
      {open && <BagDrawer bag={bag} setBag={setBag} close={() => setOpen(false)} />}
    </>
  )
}
