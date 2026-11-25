import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Bike,
  CarFront,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Clock3,
  Fuel,
  Gauge,
  Headphones,
  Camera,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MoveRight,
  Navigation,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Upload,
  Users,
  UsersRound,
  X,
  Zap,
} from 'lucide-react'
import './styles.css'
import { useAuth, AuthProvider } from './context/AuthContext'
import { apiService } from './services/api'

const vehicles = [
  {
    id: 'classic-350',
    backendId: 1,
    name: 'Classic 350',
    brand: 'Royal Enfield',
    category: 'Bikes',
    type: 'Bike',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
    hourly: 80,
    daily: 1250,
    meta: ['Petrol', 'Manual', '2 seats'],
    accent: 'Warm orange',
  },
  {
    id: 'duke-390',
    backendId: 2,
    name: 'Duke 390',
    brand: 'KTM',
    category: 'Bikes',
    type: 'Bike',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85',
    hourly: 120,
    daily: 1800,
    meta: ['Petrol', 'Manual', '2 seats'],
    accent: 'Electric lime',
  },
  {
    id: 'creta',
    backendId: 3,
    name: 'Creta',
    brand: 'Hyundai',
    category: 'SUVs',
    type: 'Car',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85',
    hourly: 240,
    daily: 3200,
    meta: ['Petrol', 'Automatic', '5 seats'],
    accent: 'Cobalt blue',
  },
  {
    id: 'thar',
    backendId: 4,
    name: 'Thar',
    brand: 'Mahindra',
    category: 'Premium Vehicles',
    type: 'Car',
    image: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=1200&q=85',
    hourly: 300,
    daily: 4200,
    meta: ['Diesel', 'Automatic', '4 seats'],
    accent: 'Desert sand',
  },
  {
    id: 'r15',
    backendId: 5,
    name: 'R15 V4',
    brand: 'Yamaha',
    category: 'Bikes',
    type: 'Bike',
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1200&q=85',
    hourly: 110,
    daily: 1600,
    meta: ['Petrol', 'Manual', '2 seats'],
    accent: 'Racing blue',
  },
  {
    id: 'nexon',
    backendId: 6,
    name: 'Nexon EV',
    brand: 'Tata',
    category: 'Cars',
    type: 'Car',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
    hourly: 220,
    daily: 2900,
    meta: ['Electric', 'Automatic', '5 seats'],
    accent: 'Mint green',
  },
]

const fallbackImages = Object.fromEntries(vehicles.map((vehicle) => [vehicle.backendId, vehicle.image]))

function normalizeVehicle(vehicle) {
  const gallery = (vehicle.images || []).map((item) => item.image_url || item.image).filter(Boolean)
  const image = vehicle.image_url || gallery[0] || fallbackImages[vehicle.id] || fallbackImages[1]
  return {
    id: String(vehicle.id),
    backendId: vehicle.id,
    name: vehicle.name,
    brand: vehicle.brand,
    category: vehicle.category,
    type: vehicle.category === 'Bikes' || vehicle.category === 'Scooters' ? 'Bike' : 'Car',
    image,
    images: gallery.length ? gallery : [image],
    hourly: Number(vehicle.hourly_price),
    daily: Number(vehicle.daily_price),
    meta: [vehicle.fuel_type, vehicle.transmission, `${vehicle.seating_capacity} seats`],
    location: vehicle.location,
    pickupAddress: vehicle.pickup_address || vehicle.location,
    description: vehicle.description,
  }
}

function useVehicleCatalog() {
  const [catalog, setCatalog] = useState(vehicles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    apiService.vehicles()
      .then((data) => {
        const results = data?.results || data || []
        if (mounted && results.length) setCatalog(results.map(normalizeVehicle))
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return { catalog, loading }
}

function HeroVehicleVideo({ className }) {
  const videoRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const hiddenVideo = videoRefs.current[1]
    if (hiddenVideo) {
      hiddenVideo.pause()
      hiddenVideo.currentTime = 0
    }
    const timer = window.setInterval(() => {
      const nextIndex = activeRef.current === 0 ? 1 : 0
      const nextVideo = videoRefs.current[nextIndex]
      if (nextVideo) {
        nextVideo.currentTime = 0
        nextVideo.play().catch(() => {})
      }
      activeRef.current = nextIndex
      setActiveIndex(nextIndex)
      window.setTimeout(() => {
        const previousVideo = videoRefs.current[nextIndex === 0 ? 1 : 0]
        if (previousVideo) {
          previousVideo.pause()
          previousVideo.currentTime = 0
        }
      }, 750)
    }, 5200)
    return () => window.clearInterval(timer)
  }, [])

  return <>{[0, 1].map((index) => <video key={index} ref={(element) => { videoRefs.current[index] = element }} className={`${className} hero-video-layer ${activeIndex === index ? 'is-active' : ''}`} autoPlay={index === 0} muted loop playsInline preload="auto" aria-hidden="true" poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=90" onError={(event) => { event.currentTarget.style.display = 'none' }}><source src="/hero-india-vehicles.mp4" type="video/mp4" /></video>)}</>
}

const testimonials = [
  { quote: 'The easiest way I have found to get around Bengaluru. The bike was spotless and ready before I arrived.', name: 'Aarav Menon', role: 'Weekend explorer', initials: 'AM' },
  { quote: 'YOURS feels like the future of rentals — clear pricing, beautiful cars and zero back-and-forth.', name: 'Rhea Kapoor', role: 'Frequent traveller', initials: 'RK' },
  { quote: 'Booked a Thar for a road trip in under two minutes. The whole experience was calm and genuinely premium.', name: 'Kabir Shah', role: 'Road tripper', initials: 'KS' },
]

const faqs = [
  ['Can I rent a vehicle by the hour?', 'Yes. Every vehicle on YOURS has an hourly rate, so you only pay for the time you need. Daily pricing is automatically applied when it offers better value.'],
  ['What documents do I need to rent?', 'You’ll need a valid driving licence and a government-issued ID. Our team verifies these securely before your first ride.'],
  ['How do I know a vehicle will be available?', 'Choose your pickup and return window during search. YOURS checks confirmed bookings in real time, so availability is always based on your exact dates.'],
  ['Can I cancel my booking?', 'Yes. You can cancel from your dashboard. Cancellation terms are clearly shown before you pay and vary slightly by how close you are to pickup.'],
]

function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="YOURS home">
      <span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 30 24" role="img"><path d="M3 21 8.2 4" /><path d="M12.5 21 16.1 4" /><path d="M22 21 24.8 4" /></svg></span>
      <span className="logo-word">YOURS</span>
    </Link>
  )
}

function Button({ children, variant = 'primary', className = '', onClick, href, type = 'button' }) {
  const classes = `button button-${variant} ${className}`
  if (href) return <a href={href} className={classes} onClick={onClick}>{children}</a>
  return <button type={type} className={classes} onClick={onClick}>{children}</button>
}

function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const darkHeader = location.pathname === '/' || location.pathname === '/explore'
  return (
    <header className={`site-nav ${darkHeader ? '' : 'site-nav-light'}`}>
      <div className="container nav-inner">
        <Logo light={darkHeader} />
        <nav className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          <a href="/" onClick={() => setOpen(false)}>Home</a>
          <Link to="/explore" onClick={() => setOpen(false)}>Explore vehicles</Link>
          <a href="/#how-it-works" onClick={() => setOpen(false)}>How it works</a>
          <a href="/#about" onClick={() => setOpen(false)}>About us</a>
          <a href="/#contact" onClick={() => setOpen(false)}>Contact</a>
          <div className="nav-mobile-cta">
            {user ? <Button variant="outline" href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Button> : <Button variant="outline" href="/login" onClick={() => setOpen(false)}>Log in</Button>}
            {user ? <Button href="/" onClick={() => { logout(); setOpen(false) }}>Log out</Button> : <Button href="/explore" onClick={() => setOpen(false)}>Get started <ArrowRight size={16} /></Button>}
          </div>
        </nav>
        <div className="nav-actions">
          {user ? <a className="nav-login" href="/dashboard">Dashboard</a> : <a className="nav-login" href="/login">Log in</a>}
          {user ? <Button className="nav-cta" onClick={logout}>Log out</Button> : <Button className="nav-cta" href="/explore">Get started <ArrowRight size={16} /></Button>}
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function BookingSearch({ compact = false }) {
  const navigate = useNavigate()
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const [type, setType] = useState('All vehicles')
  const [location, setLocation] = useState('Bengaluru')
  const [date, setDate] = useState(tomorrow)
  const [submitted, setSubmitted] = useState(false)
  const search = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => navigate(`/explore?type=${encodeURIComponent(type)}&location=${encodeURIComponent(location)}&date=${date}`), 450)
  }
  return (
    <form className={`booking-search ${compact ? 'booking-search-compact' : ''}`} onSubmit={search}>
      <div className="booking-field booking-select-field">
        <span className="field-icon"><Bike size={18} /></span>
        <label>Vehicle type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>All vehicles</option><option>Cars</option><option>Bikes</option><option>Scooters</option>
        </select>
      </div>
      <div className="booking-field">
        <span className="field-icon"><MapPin size={18} /></span>
        <label>Pickup location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or area" />
      </div>
      <div className="booking-field">
        <span className="field-icon"><CalendarDays size={18} /></span>
        <label>Pickup date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="booking-field booking-field-time">
        <span className="field-icon"><Clock3 size={18} /></span>
        <label>Pickup time</label>
        <input type="time" defaultValue="10:00" />
      </div>
      <Button type="submit" className="booking-submit" disabled={submitted}>{submitted ? <><Check size={17} /> Searching</> : <>Search availability <ArrowRight size={17} /></>}</Button>
    </form>
  )
}

function VehicleCard({ vehicle, featured = false }) {
  return (
    <motion.article className={`vehicle-card ${featured ? 'vehicle-card-featured' : ''}`} whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <div className="vehicle-image-wrap">
        <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.name}`} className="vehicle-image" loading="lazy" />
        <span className="vehicle-type-chip">{vehicle.type}</span>
        <button className="heart-button" aria-label={`Save ${vehicle.name}`}><Sparkles size={16} /></button>
      </div>
      <div className="vehicle-card-content">
        <div className="vehicle-title-row">
          <div><p className="eyebrow">{vehicle.brand}</p><h3>{vehicle.name}</h3></div>
          <div className="vehicle-rating"><Star size={14} fill="currentColor" /> 4.9</div>
        </div>
        <div className="vehicle-meta">
          <span><Fuel size={14} /> {vehicle.meta[0]}</span><span><Gauge size={14} /> {vehicle.meta[1]}</span><span><Users size={14} /> {vehicle.meta[2]}</span>
        </div>
        <div className="vehicle-card-footer">
          <div><span className="price-label">From</span><strong>₹{vehicle.hourly}<small>/hr</small></strong><span className="daily-price">₹{vehicle.daily}/day</span></div>
          <Link to={`/vehicle/${vehicle.id}`} className="icon-link" aria-label={`View ${vehicle.name}`}><ArrowUpRight /></Link>
        </div>
      </div>
    </motion.article>
  )
}

function Home() {
  const { catalog } = useVehicleCatalog()
  const [activeCategory, setActiveCategory] = useState('All')
  const [faqOpen, setFaqOpen] = useState(0)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const filtered = useMemo(() => activeCategory === 'All' ? catalog.slice(0, 4) : catalog.filter((v) => v.category === activeCategory || v.type === activeCategory).slice(0, 4), [activeCategory, catalog])
  const subscribe = (e) => { e.preventDefault(); if (email.includes('@')) setSubscribed(true) }
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-photo"></div><HeroVehicleVideo className="hero-video" /><div className="hero-motion" aria-hidden="true"><span></span><span></span><span></span></div><div className="hero-shade"></div>
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="kicker-line"></span><span>Premium mobility, made simple</span></div>
            <h1>Find your ride.<br /><em>Own your journey.</em></h1>
            <p>Premium cars and bikes for every journey. Rent by the hour, explore freely, and pay only for the time you need.</p>
            <div className="hero-actions"><Button href="#book">Explore vehicles <ArrowRight size={17} /></Button><Button variant="ghost-light" href="#how-it-works"><span className="play-icon">▶</span> How it works</Button></div>
          </div>
          <div className="hero-note"><span>01</span><span className="hero-note-line"></span><span>New Delhi · Bengaluru · Mumbai</span></div>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><MoveRight size={17} /></div>
      </section>

      <main>
        <section className="booking-section container" id="book">
          <div className="booking-heading"><div><span className="section-label">Start your journey</span><h2>Where will you go next?</h2></div><p>Tell us what you need.<br />We’ll handle the rest.</p></div>
          <BookingSearch />
        </section>

        <section className="section container" id="explore">
          <div className="section-heading-row"><div><span className="section-label">The YOURS collection</span><h2>Pick a ride that <em>feels like you.</em></h2></div><Link to="/explore" className="text-link">View all vehicles <ArrowRight size={16} /></Link></div>
          <div className="category-tabs" role="tablist">{['All', 'Cars', 'Bikes', 'Premium Vehicles'].map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
          <div className="vehicle-grid">{filtered.map((vehicle, index) => <VehicleCard vehicle={vehicle} featured={index === 0} key={vehicle.id} />)}</div>
        </section>

        <section className="trust-strip"><div className="container trust-grid"><div><strong>4.9<span>/5</span></strong><p>Average customer rating</p></div><div><strong>12k<span>+</span></strong><p>Journeys completed</p></div><div><strong>38<span>+</span></strong><p>Pickup spots across India</p></div><div><strong>24<span>/7</span></strong><p>Human support</p></div></div></section>

        <section className="section how-section container" id="how-it-works">
          <div className="section-heading-row"><div><span className="section-label">Simple by design</span><h2>Your journey, <em>your way.</em></h2></div><p className="heading-aside">From a quick city run to a weekend out of town, YOURS makes every ride feel effortless.</p></div>
          <div className="steps-grid"><div className="step-card"><span className="step-number">01</span><div className="step-icon"><Search size={22} /></div><h3>Find your fit</h3><p>Browse our curated collection and choose the vehicle that matches your plans.</p><ArrowRight className="step-arrow" size={20} /></div><div className="step-card step-card-dark"><span className="step-number">02</span><div className="step-icon"><CalendarDays size={22} /></div><h3>Pick your time</h3><p>Book by the hour or by the day. Flexible rentals, transparent prices, no surprises.</p><ArrowRight className="step-arrow" size={20} /></div><div className="step-card step-card-orange"><span className="step-number">03</span><div className="step-icon"><Navigation size={22} /></div><h3>Just go</h3><p>Collect your ride from a nearby spot and start making the day yours.</p><ArrowRight className="step-arrow" size={20} /></div></div>
        </section>

        <section className="feature-banner" id="about"><div className="container feature-banner-inner"><div className="feature-image"><img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85" alt="Sports car on a scenic road" /></div><div className="feature-copy"><span className="section-label light-label">More than a rental</span><h2>Go where the good<br /><em>stories begin.</em></h2><p>We believe the best journeys are the ones you didn’t overthink. That’s why we make premium mobility feel personal, flexible and beautifully straightforward.</p><div className="feature-points"><span><Check size={15} /> Curated, well-kept vehicles</span><span><Check size={15} /> Clear pricing, always</span><span><Check size={15} /> People who care, 24/7</span></div><Button variant="light" href="#contact">Meet YOURS <ArrowRight size={16} /></Button></div></div></section>

        <section className="section testimonial-section container"><div className="section-heading-row"><div><span className="section-label">Good things, shared</span><h2>Made for the <em>moments between.</em></h2></div><div className="testimonial-controls"><button aria-label="Previous testimonial">←</button><button aria-label="Next testimonial">→</button></div></div><div className="testimonials-grid">{testimonials.map((item) => <article className="testimonial-card" key={item.name}><div className="quote-mark">“</div><p>{item.quote}</p><div className="testimonial-person"><span className="avatar">{item.initials}</span><span><strong>{item.name}</strong><small>{item.role}</small></span><span className="stars"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></span></div></article>)}</div></section>

        <section className="faq-section" id="contact"><div className="container faq-layout"><div><span className="section-label">Questions, answered</span><h2>Good to<br /><em>know.</em></h2><p>Still curious? Our humans are one message away.</p><a href="mailto:hello@yours.rent" className="text-link">hello@yours.rent <ArrowUpRight size={16} /></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${faqOpen === index ? 'faq-open' : ''}`} key={question}><button onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}><span>{question}</span><ChevronDown size={18} /></button><AnimatePresence initial={false}>{faqOpen === index && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{answer}</p></motion.div>}</AnimatePresence></div>)}</div></div></section>

        <section className="newsletter-section"><div className="container newsletter-inner"><div><span className="section-label light-label">Stay in the loop</span><h2>More road. Less noise.</h2><p>New rides, city guides and good reasons to take the long way home.</p></div>{subscribed ? <div className="newsletter-success"><Check size={18} /> You’re on the list. See you out there.</div> : <form className="newsletter-form" onSubmit={subscribe}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" required /><button type="submit" aria-label="Subscribe"><ArrowRight size={19} /></button></form>}</div></section>
      </main>
      <Footer />
    </>
  )
}

function Explore() {
  const { catalog, loading } = useVehicleCatalog()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(() => params.get('type') && params.get('type') !== 'All vehicles' ? params.get('type') : 'All')
  const [sort, setSort] = useState('Recommended')
  const location = params.get('location') || ''
  const filtered = useMemo(() => {
    let list = catalog.filter((vehicle) => (category === 'All' || vehicle.category === category || vehicle.type === category) && (!location || vehicle.location?.toLowerCase().includes(location.toLowerCase())) && `${vehicle.brand} ${vehicle.name}`.toLowerCase().includes(query.toLowerCase()))
    if (sort === 'Price: low to high') list = [...list].sort((a, b) => a.hourly - b.hourly)
    if (sort === 'Price: high to low') list = [...list].sort((a, b) => b.hourly - a.hourly)
    return list
  }, [category, catalog, location, query, sort])
  return <div className="page-shell"><section className="explore-hero"><div className="explore-hero-fallback" aria-hidden="true"></div><img className="explore-hero-animation" src="/car-hero.gif" alt="" aria-hidden="true" /><HeroVehicleVideo className="explore-hero-video" /><div className="explore-hero-motion" aria-hidden="true"><span></span><span></span><span></span></div><div className="explore-hero-shade" aria-hidden="true"></div><div className="container"><span className="section-label light-label">The collection</span><h1>Find the one<br /><em>that moves you.</em></h1><p>Thoughtfully selected cars, bikes and scooters — ready when you are.</p></div></section><main className="section container explore-page"><div className="explore-toolbar"><div className="search-input"><Search size={17} /><input placeholder="Search by name or brand" value={query} onChange={(e) => setQuery(e.target.value)} /></div><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Recommended</option><option>Price: low to high</option><option>Price: high to low</option></select></div><div className="category-tabs explore-tabs">{['All', 'Cars', 'Bikes', 'SUVs', 'Premium Vehicles'].map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="explore-results"><span>{loading ? 'Loading vehicles…' : `${filtered.length} vehicles available`}</span><span className="available-indicator"><i></i> Live availability</span></div><div className="vehicle-grid">{filtered.map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle.id} />)}</div>{!loading && filtered.length === 0 && <div className="empty-state"><CircleHelp size={32} /><h3>No rides found</h3><p>Try a different search or category.</p></div>}</main></div>
}

function VehicleDetails() {
  const { id } = useParams()
  const { catalog } = useVehicleCatalog()
  const vehicle = catalog.find((item) => item.id === id || String(item.backendId) === id) || vehicles.find((item) => item.id === id) || catalog[0]
  const { user } = useAuth()
  const navigate = useNavigate()
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const [pickupDate, setPickupDate] = useState(tomorrow)
  const [returnDate, setReturnDate] = useState(tomorrow)
  const [pickupTime, setPickupTime] = useState('10:00')
  const [returnTime, setReturnTime] = useState('16:00')
  const [bookingState, setBookingState] = useState('idle')
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [hours, setHours] = useState(6)
  useEffect(() => {
    const start = new Date(`${pickupDate}T${pickupTime}`)
    const end = new Date(`${returnDate}T${returnTime}`)
    const nextHours = Math.ceil((end - start) / 3600000)
    setHours(Number.isFinite(nextHours) && nextHours > 0 ? nextHours : 1)
  }, [pickupDate, returnDate, pickupTime, returnTime])
  const total = hours * vehicle.hourly
  const confirmPayment = async (booking, order) => {
    if (!order.key_id) {
      return apiService.verifyPayment({
        razorpay_order_id: order.order_id,
        razorpay_payment_id: `local_test_payment_${Date.now()}`,
        razorpay_signature: 'test_signature',
      })
    }
    if (!window.Razorpay) throw new Error('Razorpay Checkout could not load. Check your internet connection and reload the page.')
    return new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'YOURS',
        description: `30% advance for ${vehicle.brand} ${vehicle.name}`,
        order_id: order.order_id,
        prefill: { name: user.full_name, email: user.email, contact: user.phone || '' },
        theme: { color: '#ff6b35' },
        handler: async (response) => {
          try { resolve(await apiService.verifyPayment(response)) } catch (error) { reject(error) }
        },
      })
      checkout.on('payment.failed', (response) => reject(new Error(response.error?.description || 'Payment failed. Your booking hold is still available for a short time.')))
      checkout.open()
    })
  }
  const submitBooking = async (event) => {
    event.preventDefault()
    if (!user) {
      navigate(`/login?next=/vehicle/${vehicle.id}`)
      return
    }
    setBookingState('saving')
    setBookingError('')
    try {
      const booking = await apiService.createBooking({
        vehicle_id: vehicle.backendId,
        pickup_datetime: new Date(`${pickupDate}T${pickupTime}`).toISOString(),
        return_datetime: new Date(`${returnDate}T${returnTime}`).toISOString(),
      })
      const order = await apiService.createOrder(booking.id)
      const payment = await confirmPayment(booking, order)
      setBookingState('success')
      const pickupLocation = payment.pickup_location || booking.vehicle_pickup_address || vehicle.pickupAddress || vehicle.location
      setBookingMessage(`Booking ${booking.booking_reference} confirmed. Pick up your ${vehicle.name} from ${pickupLocation}. Advance paid: ₹${Number(payment.advance_amount || order.advance_amount || 0).toLocaleString('en-IN')}.`)
    } catch (error) {
      setBookingState('error')
      setBookingError(error.message)
    }
  }
  return <div className="page-shell"><main className="details-page container"><Link to="/explore" className="back-link">← Back to vehicles</Link><div className="details-grid"><div className="details-gallery"><img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.name}`} /><div className="gallery-caption"><span>YOURS / {vehicle.category}</span><span><Star size={14} fill="currentColor" /> 4.9 · 28 reviews</span></div></div><div className="details-content"><span className="section-label">{vehicle.brand}</span><h1>{vehicle.name}</h1><p className="details-description">A confident, comfortable ride for the city, the coast and every spontaneous plan in between.</p><div className="details-price"><strong>₹{vehicle.hourly}</strong><span>/ hour</span><span className="price-divider">or</span><strong>₹{vehicle.daily}</strong><span>/ day</span></div><div className="spec-grid">{vehicle.meta.map((spec, index) => <div key={spec}><span>{index === 0 ? <Fuel size={16} /> : index === 1 ? <Gauge size={16} /> : <Users size={16} />}</span><small>{['Fuel', 'Transmission', 'Capacity'][index]}</small><strong>{spec}</strong></div>)}</div><form className="booking-box" onSubmit={submitBooking}><div className="booking-box-head"><div><span className="section-label">Quick estimate</span><h3>Make it yours</h3></div><Tag size={20} /></div><div className="booking-dates"><label>Pickup date<input type="date" value={pickupDate} min={tomorrow} onChange={(event) => setPickupDate(event.target.value)} required /></label><label>Pickup time<input type="time" value={pickupTime} onChange={(event) => setPickupTime(event.target.value)} required /></label><label>Return date<input type="date" value={returnDate} min={pickupDate} onChange={(event) => setReturnDate(event.target.value)} required /></label><label>Return time<input type="time" value={returnTime} onChange={(event) => setReturnTime(event.target.value)} required /></label></div><div className="hours-summary"><span>Total duration</span><strong>{hours} {hours === 1 ? 'hour' : 'hours'}</strong></div><div className="estimate-row"><span>Estimated rental before tax/deposit</span><strong>₹{total.toLocaleString('en-IN')}</strong></div><p className="advance-note">Pay 30% advance through Razorpay to confirm. The remaining amount is payable according to your rental terms.</p>{bookingMessage && <p className="booking-success"><Check size={16} /> {bookingMessage}</p>}{bookingError && <p className="booking-error">{bookingError}</p>}<Button type="submit" className="full-width" disabled={bookingState === 'saving' || bookingState === 'success'}>{bookingState === 'saving' ? 'Opening payment…' : bookingState === 'success' ? 'Booking confirmed' : user ? <>Book & pay 30% advance <ArrowRight size={16} /></> : <>Log in to book <ArrowRight size={16} /></>}</Button></form></div></div></main></div>
}

function AuthShell({ eyebrow, title, subtitle, children }) {
  return <div className="auth-page"><div className="auth-image"></div><div className="auth-panel"><Logo /><div className="auth-copy"><span className="section-label">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>{children}</div></div>
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try { await login({ email, password }); navigate(params.get('next') || '/dashboard') } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  return <AuthShell eyebrow="Welcome back" title="Your next ride is waiting." subtitle="Sign in to manage your bookings, payments and profile."><form className="auth-form" onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<Button type="submit" className="full-width" disabled={saving}>{saving ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}</Button><p className="auth-switch">New to YOURS? <Link to={params.get('next') ? `/signup?next=${encodeURIComponent(params.get('next'))}` : '/signup'}>Create an account</Link></p></form></AuthShell>
}

function SignupPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try { await register(form); navigate(params.get('next') || '/dashboard') } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  return <AuthShell eyebrow="Start your journey" title="Make the next one yours." subtitle="Create an account and get moving in a few simple steps."><form className="auth-form" onSubmit={submit}><label>Full name<input value={form.full_name} onChange={update('full_name')} required /></label><label>Email address<input type="email" value={form.email} onChange={update('email')} autoComplete="email" required /></label><label>Phone number<input value={form.phone} onChange={update('phone')} inputMode="tel" required /></label><div className="auth-two-col"><label>Password<input type="password" value={form.password} onChange={update('password')} minLength="8" required /></label><label>Confirm password<input type="password" value={form.confirm_password} onChange={update('confirm_password')} minLength="8" required /></label></div>{error && <p className="form-error">{error}</p>}<Button type="submit" className="full-width" disabled={saving}>{saving ? 'Creating account…' : <>Create account <ArrowRight size={16} /></>}</Button><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></form></AuthShell>
}

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payingId, setPayingId] = useState(null)
  useEffect(() => {
    if (!user) { navigate('/login?next=/dashboard'); return }
    apiService.myBookings().then((data) => setBookings(data.results || data || [])).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [user, navigate])
  const payBooking = async (booking) => {
    setPayingId(booking.id); setError('')
    try {
      const order = await apiService.createOrder(booking.id)
      if (!order.key_id) {
        await apiService.verifyPayment({ razorpay_order_id: order.order_id, razorpay_payment_id: `local_test_payment_${Date.now()}`, razorpay_signature: 'test_signature' })
      } else {
        if (!window.Razorpay) throw new Error('Razorpay Checkout could not load. Check your internet connection and reload the page.')
        await new Promise((resolve, reject) => {
          const checkout = new window.Razorpay({
            key: order.key_id,
            amount: order.amount,
            currency: order.currency,
            name: 'YOURS',
            description: `30% advance for ${booking.vehicle_name}`,
            order_id: order.order_id,
            prefill: { name: user.full_name, email: user.email, contact: user.phone || '' },
            theme: { color: '#ff6b35' },
            handler: async (response) => { try { await apiService.verifyPayment(response); resolve() } catch (error) { reject(error) } },
          })
          checkout.on('payment.failed', (response) => reject(new Error(response.error?.description || 'Payment failed.')))
          checkout.open()
        })
      }
      const refreshed = await apiService.myBookings()
      setBookings(refreshed.results || refreshed || [])
    } catch (err) { setError(err.message) } finally { setPayingId(null) }
  }
  if (!user) return null
  return <div className="dashboard-page"><div className="dashboard-header container"><div><span className="section-label">Your YOURS</span><h1>Good to see you, {user.full_name?.split(' ')[0] || 'rider'}.</h1><p>Everything you need for the road ahead, in one place.</p></div><Button variant="outline" onClick={() => { logout(); navigate('/') }}>Log out</Button></div><main className="container dashboard-content"><div className="dashboard-stats"><div><span>Upcoming rides</span><strong>{bookings.filter((booking) => ['pending_payment', 'confirmed'].includes(booking.status)).length}</strong></div><div><span>Total bookings</span><strong>{bookings.length}</strong></div><div><span>Account</span><strong>Active</strong></div></div><div className="dashboard-section-heading"><div><span className="section-label">Your activity</span><h2>My bookings</h2></div><Link to="/explore" className="text-link">Book another ride <ArrowRight size={16} /></Link></div>{error && <p className="form-error">{error}</p>}{loading ? <div className="dashboard-empty">Loading your bookings…</div> : bookings.length === 0 ? <div className="dashboard-empty"><CalendarDays size={28} /><h3>No bookings yet</h3><p>Your next story starts with a ride.</p><Link to="/explore" className="text-link">Explore vehicles <ArrowRight size={16} /></Link></div> : <div className="booking-list">{bookings.map((booking) => <article className="booking-row" key={booking.id}><div className="booking-row-icon"><Bike size={21} /></div><div><span className="booking-reference">{booking.booking_reference}</span><h3>{booking.vehicle_name || 'Your vehicle'}</h3><p>{new Date(booking.pickup_datetime).toLocaleString()} → {new Date(booking.return_datetime).toLocaleString()}<br />Pickup: {booking.vehicle_pickup_address || booking.vehicle_location || 'Location will be shared by YOURS'}</p></div><div className={`booking-status status-${booking.status}`}>{booking.status.replace('_', ' ')}</div><strong>₹{Number(booking.total_amount).toLocaleString('en-IN')}</strong>{booking.status === 'pending_payment' && <button className="booking-pay-button" onClick={() => payBooking(booking)} disabled={payingId === booking.id}>{payingId === booking.id ? 'Processing…' : 'Pay now'}</button>}</article>)}</div>}</main></div>
}

const adminNavigation = [
  ['overview', 'Overview', LayoutDashboard],
  ['vehicles', 'Vehicles', CarFront],
  ['bookings', 'Bookings', ClipboardList],
  ['users', 'Customers', UsersRound],
  ['payments', 'Payments', CreditCard],
]

function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(user)
  const [section, setSection] = useState('overview')
  const [metrics, setMetrics] = useState(null)
  const [vehiclesData, setVehiclesData] = useState([])
  const [bookingsData, setBookingsData] = useState([])
  const [usersData, setUsersData] = useState([])
  const [paymentsData, setPaymentsData] = useState([])
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [vehicleImages, setVehicleImages] = useState([])
  const [vehicleSaving, setVehicleSaving] = useState(false)
  const [vehicleError, setVehicleError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [vehicleForm, setVehicleForm] = useState({ name: '', brand: '', category: 'Cars', registration_number: '', hourly_price: '', daily_price: '', fuel_type: 'Petrol', transmission: 'Manual', seating_capacity: 5, location: 'Bengaluru', pickup_address: 'YOURS Bengaluru pickup hub', description: '' })

  const unwrap = (data) => data?.results || data || []
  const loadAdminData = async () => {
    setLoadError('')
    try {
      const [dashboard, vehicleList, bookingList, userList, paymentList] = await Promise.all([
        apiService.adminDashboard(), apiService.adminVehicles(), apiService.adminBookings(), apiService.adminUsers(), apiService.adminPayments(),
      ])
      setMetrics(dashboard); setVehiclesData(unwrap(vehicleList)); setBookingsData(unwrap(bookingList)); setUsersData(unwrap(userList)); setPaymentsData(unwrap(paymentList))
    } catch (error) { setLoadError(error.message) }
  }

  useEffect(() => {
    if (!user) { navigate('/login?next=/admin'); return }
    apiService.profile().then(setProfile).catch(() => setProfile(user))
    loadAdminData()
  }, [user, navigate])

  if (!user) return null
  if (!profile?.is_staff && profile?.role !== 'admin') return <div className="admin-access-page"><Logo /><h1>Staff access required</h1><p>This workspace is only available to admin users.</p><Button variant="outline" onClick={() => navigate('/')}>Return home</Button></div>

  const updateVehicleField = (field) => (event) => setVehicleForm((current) => ({ ...current, [field]: event.target.value }))
  const createVehicle = async (event) => {
    event.preventDefault(); setVehicleSaving(true); setVehicleError('')
    try {
      const payload = new FormData()
      Object.entries(vehicleForm).forEach(([key, value]) => payload.append(key, value))
      if (vehicleImages[0]) payload.append('image', vehicleImages[0])
      vehicleImages.forEach((image) => payload.append('images', image))
      await apiService.adminCreateVehicle(payload)
      setShowVehicleForm(false); setVehicleImages([]); setVehicleForm({ name: '', brand: '', category: 'Cars', registration_number: '', hourly_price: '', daily_price: '', fuel_type: 'Petrol', transmission: 'Manual', seating_capacity: 5, location: 'Bengaluru', pickup_address: 'YOURS Bengaluru pickup hub', description: '' }); await loadAdminData()
    } catch (error) { setVehicleError(error.message) } finally { setVehicleSaving(false) }
  }
  const updateBooking = async (bookingId, status) => { try { await apiService.adminUpdateBooking(bookingId, { status }); await loadAdminData() } catch (error) { setLoadError(error.message) } }
  const updateUser = async (userId, is_active) => { try { await apiService.adminUpdateUser(userId, { is_active }); await loadAdminData() } catch (error) { setLoadError(error.message) } }

  const renderOverview = () => <><div className="admin-metrics">{[['Customers', metrics?.customers || 0, UsersRound], ['Active vehicles', metrics?.vehicles || 0, CarFront], ['Total bookings', metrics?.bookings || 0, ClipboardList], ['Revenue', `₹${Number(metrics?.revenue || 0).toLocaleString('en-IN')}`, CreditCard]].map(([label, value, Icon]) => <div className="admin-metric" key={label}><span className="admin-metric-icon"><Icon size={18} /></span><span>{label}</span><strong>{value}</strong><small>Live from Django</small></div>)}</div><div className="admin-overview-grid"><section className="admin-panel-card"><div className="admin-panel-heading"><div><span className="section-label">Latest activity</span><h2>Recent bookings</h2></div><button className="admin-text-button" onClick={() => setSection('bookings')}>View all <ArrowRight size={15} /></button></div>{bookingsData.slice(0, 5).map((booking) => <div className="admin-mini-row" key={booking.id}><div className="admin-mini-icon"><Bike size={17} /></div><div><strong>{booking.vehicle_name || 'Vehicle booking'}</strong><span>{booking.booking_reference} · {booking.user_email}</span></div><b>₹{Number(booking.total_amount).toLocaleString('en-IN')}</b></div>)}{bookingsData.length === 0 && <div className="admin-empty">No bookings yet.</div>}</section><section className="admin-panel-card"><div className="admin-panel-heading"><div><span className="section-label">Revenue pulse</span><h2>Monthly revenue</h2></div></div><div className="revenue-bars">{(metrics?.monthly_revenue || []).slice(-6).map((item) => <div className="revenue-bar" key={item.month}><div style={{ height: `${Math.max(8, Math.min(100, Number(item.total) / Math.max(1, Number(metrics?.revenue || 1)) * 500))}%` }}></div><span>{new Date(item.month).toLocaleDateString('en-IN', { month: 'short' })}</span></div>)}{!(metrics?.monthly_revenue || []).length && <div className="admin-empty">Revenue appears after successful payments.</div>}</div></section></div></>

  const renderVehicles = () => <section className="admin-panel-card"><div className="admin-panel-heading"><div><span className="section-label">Fleet control</span><h2>Vehicles</h2></div><Button onClick={() => setShowVehicleForm(!showVehicleForm)}>{showVehicleForm ? <><X size={16} /> Close</> : <><Plus size={16} /> Add vehicle</>}</Button></div>{showVehicleForm && <form className="vehicle-admin-form" onSubmit={createVehicle}><div className="admin-form-grid"><label>Vehicle name<input value={vehicleForm.name} onChange={updateVehicleField('name')} required /></label><label>Brand<input value={vehicleForm.brand} onChange={updateVehicleField('brand')} required /></label><label>Category<select value={vehicleForm.category} onChange={updateVehicleField('category')}><option>Cars</option><option>Bikes</option><option>Scooters</option><option>SUVs</option><option>Premium Vehicles</option></select></label><label>Registration number<input value={vehicleForm.registration_number} onChange={updateVehicleField('registration_number')} required /></label><label>Hourly price<input type="number" min="0" value={vehicleForm.hourly_price} onChange={updateVehicleField('hourly_price')} required /></label><label>Daily price<input type="number" min="0" value={vehicleForm.daily_price} onChange={updateVehicleField('daily_price')} required /></label><label>Fuel type<select value={vehicleForm.fuel_type} onChange={updateVehicleField('fuel_type')}><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select></label><label>Transmission<select value={vehicleForm.transmission} onChange={updateVehicleField('transmission')}><option>Manual</option><option>Automatic</option></select></label><label>Seats<input type="number" min="1" value={vehicleForm.seating_capacity} onChange={updateVehicleField('seating_capacity')} required /></label><label>Pickup location<input value={vehicleForm.location} onChange={updateVehicleField('location')} required /></label><label className="admin-form-wide">Pickup address<input value={vehicleForm.pickup_address} onChange={updateVehicleField('pickup_address')} placeholder="Exact pickup address or hub" required /></label><label className="admin-form-wide">Description<textarea value={vehicleForm.description} onChange={updateVehicleField('description')} rows="3" /></label><label className="upload-field admin-form-wide"><span><Upload size={17} /> Vehicle pictures</span><input type="file" accept="image/*" multiple onChange={(event) => setVehicleImages(Array.from(event.target.files || []))} required /><small>{vehicleImages.length ? `${vehicleImages.length} photo${vehicleImages.length === 1 ? '' : 's'} selected` : 'Upload one or more JPG, PNG or WebP photos'}</small></label></div>{vehicleError && <p className="form-error">{vehicleError}</p>}<Button type="submit" disabled={vehicleSaving}>{vehicleSaving ? 'Saving vehicle…' : 'Save vehicle'}</Button></form>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Vehicle</th><th>Category</th><th>Location</th><th>Hourly</th><th>Status</th></tr></thead><tbody>{vehiclesData.map((vehicle) => <tr key={vehicle.id}><td><div className="vehicle-admin-cell">{vehicle.image_url ? <img src={vehicle.image_url} alt="" /> : <span><CarFront size={16} /></span>}<div><strong>{vehicle.brand} {vehicle.name}</strong><small>{vehicle.registration_number}</small></div></div></td><td>{vehicle.category}</td><td>{vehicle.location}</td><td>₹{vehicle.hourly_price}/hr</td><td><span className={`admin-pill ${vehicle.is_active ? 'pill-green' : 'pill-gray'}`}>{vehicle.is_active ? 'Active' : 'Inactive'}</span></td></tr>)}</tbody></table></div></section>

  const renderBookings = () => <section className="admin-panel-card"><div className="admin-panel-heading"><div><span className="section-label">Rental operations</span><h2>Bookings</h2></div><button className="admin-icon-button" onClick={loadAdminData} aria-label="Refresh bookings"><RefreshCw size={16} /></button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Schedule</th><th>Total</th><th>Status</th></tr></thead><tbody>{bookingsData.map((booking) => <tr key={booking.id}><td><strong>{booking.booking_reference}</strong></td><td>{booking.user_email}</td><td>{booking.vehicle_name}</td><td>{new Date(booking.pickup_datetime).toLocaleDateString()}<small className="table-subtext">{new Date(booking.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {new Date(booking.return_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></td><td>₹{Number(booking.total_amount).toLocaleString('en-IN')}</td><td><select className="status-select" value={booking.status} onChange={(event) => updateBooking(booking.id, event.target.value)}><option value="pending_payment">Pending payment</option><option value="confirmed">Confirmed</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option></select></td></tr>)}</tbody></table></div></section>

  const renderUsers = () => <section className="admin-panel-card"><div className="admin-panel-heading"><div><span className="section-label">Customer accounts</span><h2>Users</h2></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Phone</th><th>Role</th><th>Joined</th><th>Access</th></tr></thead><tbody>{usersData.map((customer) => <tr key={customer.id}><td><strong>{customer.full_name || 'Unnamed customer'}</strong><small className="table-subtext">{customer.email}</small></td><td>{customer.phone || '—'}</td><td>{customer.role}</td><td>{new Date(customer.created_at).toLocaleDateString()}</td><td><button className={`admin-pill ${customer.is_active ? 'pill-green' : 'pill-gray'}`} onClick={() => updateUser(customer.id, !customer.is_active)}>{customer.is_active ? 'Active' : 'Disabled'}</button></td></tr>)}</tbody></table></div></section>

  const renderPayments = () => <section className="admin-panel-card"><div className="admin-panel-heading"><div><span className="section-label">Money movement</span><h2>Payments</h2></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Booking</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{paymentsData.map((payment) => <tr key={payment.id}><td><strong>{payment.razorpay_order_id || '—'}</strong></td><td>{payment.booking_reference}</td><td>{payment.user_email || '—'}</td><td>₹{Number(payment.amount).toLocaleString('en-IN')}</td><td><span className={`admin-pill ${payment.status === 'captured' ? 'pill-green' : 'pill-gray'}`}>{payment.status}</span></td><td>{new Date(payment.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>

  return <div className="admin-shell"><aside className="admin-sidebar"><Logo light /><div className="admin-sidebar-label">Operations</div><nav>{adminNavigation.map(([key, label, Icon]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}><Icon size={17} /> {label}</button>)}</nav><div className="admin-sidebar-bottom"><div className="admin-avatar">{(profile.full_name || profile.email || 'A').slice(0, 1).toUpperCase()}</div><div><strong>{profile.full_name || profile.email}</strong><span>Administrator</span></div><button onClick={() => { logout(); navigate('/login') }} aria-label="Log out"><LogOut size={16} /></button></div></aside><main className="admin-main"><header className="admin-topbar"><div><span className="section-label">YOURS operations</span><h1>{adminNavigation.find(([key]) => key === section)?.[1]}</h1></div><div className="admin-topbar-actions"><span className="live-dot"><i></i> Live system</span><button className="admin-icon-button" onClick={loadAdminData} aria-label="Refresh dashboard"><RefreshCw size={16} /></button></div></header><div className="admin-content">{loadError && <div className="admin-alert">{loadError}</div>}{section === 'overview' && renderOverview()}{section === 'vehicles' && renderVehicles()}{section === 'bookings' && renderBookings()}{section === 'users' && renderUsers()}{section === 'payments' && renderPayments()}</div></main></div>
}

function Footer() {
  return <footer className="footer"><div className="container footer-top"><div><Logo light /><p className="footer-tagline">Your journey. Your vehicle.<br />Your freedom.</p></div><div className="footer-links"><div><span>Explore</span><Link to="/explore">All vehicles</Link><a href="#book">How it works</a><a href="#about">About YOURS</a></div><div><span>Help</span><a href="mailto:hello@yours.rent">Contact us</a><a href="#contact">FAQs</a><a href="mailto:hello@yours.rent">Support</a></div><div><span>Follow along</span><a href="https://instagram.com" target="_blank" rel="noreferrer"><Camera size={15} /> Instagram</a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></div></div></div><div className="container footer-bottom"><span>© 2026 YOURS Mobility Pvt. Ltd.</span><span>Made for the road ahead <span className="footer-dot">•</span> India</span></div></footer>
}

function HashScroller() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])
  return null
}

function App() {
  return <><HashScroller /><Nav /><AnimatePresence mode="wait"><Routes><Route path="/" element={<Home />} /><Route path="/explore" element={<Explore />} /><Route path="/vehicle/:id" element={<VehicleDetails />} /><Route path="/login" element={<LoginPage />} /><Route path="/signup" element={<SignupPage />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/admin" element={<AdminPage />} /></Routes></AnimatePresence></>
}

createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>)
