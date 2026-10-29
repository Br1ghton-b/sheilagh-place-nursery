import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { authClient } from './auth'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.5 22v-8h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5H16V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7v3h2.3v8h4.2Z" fill="currentColor"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18.9 5.1A9.7 9.7 0 0 0 12.1 2C6.7 2 2.3 6.4 2.3 11.8c0 1.8.5 3.5 1.3 5l-1.3 4.7 4.9-1.3a9.9 9.9 0 0 0 4.9 1.3h.1c5.4 0 9.8-4.4 9.8-9.8 0-2.6-1-5.1-2.9-7.1Zm-6.8 14.8h-.1c-1.3 0-2.6-.3-3.7-.9l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 0 1 3.8 11.8c0-4.5 3.7-8.2 8.3-8.2 2.2 0 4.3.9 5.9 2.5a8.2 8.2 0 0 1 2.4 5.8c0 4.5-3.7 8.2-8.2 8.2Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.1.2-.5.8-.7 1-.1.1-.2.1-.4.1-.2-.1-.8-.3-1.6-.9-.6-.5-1-1.1-1.1-1.3-.1-.2 0-.3.1-.4l.2-.2c.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.6-1.3-.8-1.8-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.2-.8.8-.8 2 0 1.2.8 2.3.9 2.5.1.2 1.6 2.6 4 3.7.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.5 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" fill="currentColor"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21.8 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.9-4.2 2.9-7.2Z" fill="#4285F4"/>
      <path d="M12 22c2.6 0 4.8-.8 6.4-2.3l-3.1-2.4c-.8.5-1.9.9-3.3.9-2.5 0-4.7-1.7-5.5-4H.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853"/>
      <path d="M6.5 20.1A6 6 0 0 1 6 17.1V14.5H2.9A10 10 0 0 0 2 12c0-1.6.4-3.1 1.1-4.4L6.5 10c-.3.8-.5 1.7-.5 2.6s.2 1.8.5 2.6l0 4.9Z" fill="#FBBC05"/>
      <path d="M12 4.1c1.4 0 2.7.5 3.7 1.4l2.7-2.7A10 10 0 0 0 2 7.6L6.1 10A6 6 0 0 1 12 4.1Z" fill="#EA4335"/>
    </svg>
  )
}

const galleryItems = [
  { src: '/gallery/WhatsApp Image 2026-10-29 at 10.13.24 (1).jpeg', alt: 'Children smiling together at nursery' },
  { src: '/gallery/WhatsApp Image 2026-10-29 at 10.13.25 (1).jpeg', alt: 'Group learning and playing outdoors' },
  { src: '/gallery/WhatsApp Image 2026-10-29 at 10.13.27.jpeg', alt: 'Nursery learners exploring in the garden' },
  { src: '/gallery/WhatsApp Image 2026-10-29 at 10.13.28.jpeg', alt: 'Children harvesting vegetables in the garden' },
  { src: '/gallery/WhatsApp Image 2026-10-29 at 10.13.29.jpeg', alt: 'Creative classroom activity' },
  { src: '/gallery/WhatsApp Image 2026-10-29 at 10.13.30.jpeg', alt: 'Children enjoying swim-time activities' },
  { src: '/gallery/32506920_2080015738950052_7338211921708974080_n.jpg', alt: 'Children learning from the fire engine visit' },
  { src: '/gallery/32560327_2080015825616710_2777953549626114048_n.jpg', alt: 'Nursery children with the fire truck' },
  { src: '/gallery/83917635_2552543788363909_1856697452774555648_n.jpg', alt: 'Children exploring a sensory play activity outdoors' },
  { src: '/gallery/107900319_2694571420827811_5676584438255271705_n.jpg', alt: 'Colourful outdoor learning area and garden play' },
  { src: '/gallery/108009524_2694264287525191_1013755769388775307_n.jpg', alt: 'Teacher and children in a classroom activity' },
  { src: '/gallery/108382977_2694571304161156_3131841670352801205_n.jpg', alt: 'Children enjoying creative outdoor play in the tyre garden' },
  { src: '/gallery/108681654_2694571377494482_8900586307923045889_n.jpg', alt: 'Colourful classroom with tables and activity corners' },
  { src: '/gallery/492400497_4081638828787723_5538571511614428386_n.jpg', alt: 'Children gathering for a festive outdoor celebration' },
  { src: '/gallery/492549386_4081638965454376_85447763151208011_n.jpg', alt: 'Children enjoying active play outdoors on ride-on toys' },
  { src: '/gallery/493181996_4081638982121041_334191164910874829_n.jpg', alt: 'Children riding toys in the outdoor play area' },
  { src: '/gallery/504264410_4124294001188872_7660294188371497435_n.jpg', alt: 'Children singing together on stage during a performance' },
]

const highlights = [
  {
    icon: '📚',
    title: 'Learning & Development',
    text: 'Supportive early learning experiences that encourage curiosity, confidence and growing independence.',
  },
  {
    icon: '🎨',
    title: 'Play & Discovery',
    text: 'Carefully guided activities that help children explore, create and build friendships through play.',
  },
  {
    icon: '🌱',
    title: 'Nature & Gardening',
    text: 'Our learners connect with the natural world through outdoor play and gardening on the premises.',
  },
  {
    icon: '🎉',
    title: 'Events & Activities',
    text: 'A welcoming environment where children can enjoy shared experiences and seasonal activities.',
  },
]

const activityItems = [
  {
    title: 'Sensory Learning',
    image: '/gallery/WhatsApp Image 2026-10-29 at 10.13.26.jpeg',
    text: 'Hands-on sensory play supports curiosity, discovery and early problem-solving skills.',
  },
  {
    title: 'Creative Tablework',
    image: '/gallery/WhatsApp Image 2026-10-29 at 10.13.29 (1).jpeg',
    text: 'Children build fine-motor skills and imagination through creative, guided activities.',
  },
  {
    title: 'Science & Discovery',
    image: '/gallery/WhatsApp Image 2026-10-29 at 10.13.32.jpeg',
    text: 'Little scientists explore colour, texture and cause-and-effect through playful experiments.',
  },
  {
    title: 'Outdoor Adventure',
    image: '/gallery/492549386_4081638965454376_85447763151208011_n.jpg',
    text: 'Children enjoy scooter and tyre-track play that builds confidence, movement and coordination.',
  },
  {
    title: 'Playful Learning',
    image: '/gallery/108681654_2694571377494482_8900586307923045889_n.jpg',
    text: 'Bright classroom spaces create a warm, engaging environment for active exploration and discovery.',
  },
  {
    title: 'School Celebrations',
    image: '/gallery/504264410_4124294001188872_7660294188371497435_n.jpg',
    text: 'Children flourish through performances, gatherings and shared experiences that build community.',
  },
]

const trustReviews = [
  {
    title: 'Warm & welcoming',
    text: 'Families often mention the nurturing environment and the way children feel safe, cared for and included from day one.',
  },
  {
    title: 'Learning that feels joyful',
    text: 'Parents appreciate the balance of structured learning, play and everyday discovery that helps children thrive.',
  },
  {
    title: 'A trusted community',
    text: 'The school is valued for its supportive culture, family connection and the confidence it gives parents.',
  },
]

const initialEvents = [
  { id: 1, title: 'Spring Picnic', date: '2026-08-28', description: 'Friday Spring Picnic.' },
  { id: 2, title: 'Pyjama Day + Bubble Day', date: '2026-09-01', description: 'Pyjama Day with photos and bubble activities.' },
  { id: 3, title: 'Zoo Visit', date: '2026-09-03', description: 'School zoo visit.' },
  { id: 4, title: 'Heritage Day Braai', date: '2026-09-23', description: 'Heritage Day Braai.' },
  { id: 5, title: 'School closes for holiday', date: '2026-09-25', description: 'School closes on Friday 25 September as it is a school holiday.' },
  { id: 6, title: 'Connect Day', date: '2026-11-06', description: 'Our annual Connect event on Friday 6 November. Information to follow.' },
]

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function AdminRoute({ children }) {
  const location = useLocation()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isMounted = true

    authClient.getSession()
      .then((result) => {
        if (!isMounted) return
        const hasSession = Boolean(result?.data?.session && result?.data?.user)
        setStatus(hasSession ? 'authed' : 'guest')
      })
      .catch(() => {
        if (isMounted) setStatus('guest')
      })

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  if (status === 'loading') {
    return <div className="admin-loading">Checking admin access…</div>
  }

  if (status === 'guest') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    authClient.getSession()
      .then((result) => {
        if (!isMounted) return
        if (result?.data?.session && result?.data?.user) {
          navigate('/admin', { replace: true })
        }
      })
      .catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name: email.split('@')[0] || 'Admin User',
            email,
            password,
          })
        : await authClient.signIn.email({ email, password })

      if (result?.error) {
        setError(result.error.message || 'Unable to complete admin sign in.')
        return
      }

      const sessionResult = await authClient.getSession()
      if (sessionResult?.data?.session && sessionResult?.data?.user) {
        const destination = location.state?.from || '/admin'
        navigate(destination, { replace: true })
      } else {
        setError('Your session could not be confirmed. Please try again.')
      }
    } catch (caughtError) {
      setError(caughtError?.message || 'Something went wrong while signing in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth-shell">
      <div className="admin-auth-card">
        <p className="section-label">Admin Access</p>
        <h1>{isSignUp ? 'Create Admin Account' : 'Admin Sign In'}</h1>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@school.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="admin-form-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Please wait…' : isSignUp ? 'Create admin account' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          className="text-link admin-mode-toggle"
          onClick={() => setIsSignUp((current) => !current)}
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an admin account? Create one'}
        </button>
      </div>
    </div>
  )
}

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    authClient.getSession()
      .then((result) => {
        if (!isMounted) return
        const sessionUser = result?.data?.user ?? null
        setUser(sessionUser)
        setLoading(false)

        if (!sessionUser) {
          navigate('/admin/login', { replace: true })
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false)
          navigate('/admin/login', { replace: true })
        }
      })

    return () => {
      isMounted = false
    }
  }, [navigate])

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate('/admin/login', { replace: true })
  }

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard…</div>
  }

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div>
          <p className="section-label">Admin</p>
          <h1>School dashboard</h1>
        </div>
        <button type="button" className="secondary-button admin-signout" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Welcome back</h2>
          <p>{user?.email || 'Signed in administrator'}</p>
        </div>
        <div className="admin-card">
          <h2>Quick actions</h2>
          <ul>
            <li>Review enquiry messages</li>
            <li>Update school events</li>
            <li>Refresh gallery content</li>
          </ul>
        </div>
        <div className="admin-card wide-card">
          <h2>Next steps</h2>
          <p>
            Connect your Neon Auth project URL in <strong>VITE_NEON_AUTH_URL</strong>, then add your own admin
            event and content APIs for full CRUD management.
          </p>
        </div>
      </div>
    </div>
  )
}

function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="page-shell">
      {/* ── Top Info Bar ── */}
      <div className="topinfo-bar">
        <div className="topinfo-inner">
          <div className="topinfo-left">
            <span className="topinfo-item">
              <span className="topinfo-icon">📍</span>
              20 Buckingham Avenue, Craighall Park, Johannesburg
            </span>
            <span className="topinfo-item">
              <span className="topinfo-icon">🕐</span>
              Mon – Fri: 7:00 – 17:30
            </span>
          </div>
          <div className="topinfo-right">
            <span className="topinfo-item">
              <span className="topinfo-icon">📞</span>
              <a href="tel:+27722344114">+27 72 234 4114</a>
            </span>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1Keynfw43J/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://wa.me/27722344114" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
              <a href="https://share.google/lD4xpVs0IL8rVp2ox" target="_blank" rel="noreferrer" aria-label="Google">
                <GoogleIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand-wrap">
            <img className="brand-logo" src="/logo-sheilaghs.png" alt="Sheilagh's Place Nursery logo" />
            <div className="brand-text">
              <div className="brand-name">Sheilagh&apos;s Place Nursery</div>
              <div className="brand-subtitle">Est. 1997 · Craighall Park</div>
            </div>
          </NavLink>

          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          <button
            type="button"
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span className="mobile-menu-toggle-label" aria-hidden="true">
              <span>ME</span>
              <span>NU</span>
            </span>
            <span className="mobile-menu-toggle-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <NavLink className="primary-button nav-button" to="/contact" onClick={() => setMobileMenuOpen(false)}>
            Enquire Now
          </NavLink>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu" aria-label="Mobile navigation">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
            <NavLink to="/events" onClick={() => setMobileMenuOpen(false)}>Events</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
            <NavLink to="/contact" className="mobile-menu-cta" onClick={() => setMobileMenuOpen(false)}>
              Enquire Now
            </NavLink>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <div className="footer-brand-wrap">
              <img src="/logo-sheilaghs.png" alt="Sheilagh's Place logo" />
              <div>
                <div className="brand-name">Sheilagh&apos;s Place Nursery</div>
                <div className="brand-subtitle">Est. 1997</div>
              </div>
            </div>
            <p className="footer-about">
              A warm, nurturing early childhood environment in Craighall Park, Johannesburg.
              Established in 1997, we welcome children from 1–12 years.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/share/1Keynfw43J/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://wa.me/27722344114" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
              <a href="https://share.google/lD4xpVs0IL8rVp2ox" target="_blank" rel="noreferrer" aria-label="Google">
                <GoogleIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <nav className="footer-links">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About Us</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>
          </div>

          {/* Programmes */}
          <div className="footer-col">
            <h4>Programmes</h4>
            <div className="footer-links">
              <span>Day Care (1–6 years)</span>
              <span>Pre-School (3–6 years)</span>
              <span>Aftercare (7–12 years)</span>
              <span>Holiday Care</span>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <span className="icon">📍</span>
                <span>20 Buckingham Avenue, Craighall Park, Johannesburg, 2196</span>
              </div>
              <div className="footer-contact-item">
                <span className="icon">📞</span>
                <a href="tel:+27722344114">+27 72 234 4114</a>
              </div>
              <div className="footer-contact-item">
                <span className="icon">✉</span>
                <a href="mailto:sheilaghcogger@gmail.com">sheilaghcogger@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <span>© {new Date().getFullYear()} Sheilagh&apos;s Place Nursery. All rights reserved.</span>
            <span>Craighall Park, Johannesburg</span>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp Float ── */}
      <a
        className="whatsapp-float"
        href="https://wa.me/27722344114"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
        <span>WhatsApp Us</span>
      </a>
    </div>
  )
}

function HomePage() {
  const [expandedGallery, setExpandedGallery] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const visibleGalleryItems = expandedGallery ? galleryItems : galleryItems.slice(0, 3)

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ width: '100%' }}>
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-breadcrumb">Craighall Park, Johannesburg</div>
              <h1 className="hero-title">
                A Place to <span>Learn</span>, Grow &amp; Flourish
              </h1>
              <p className="hero-desc">
                Welcome to Sheilagh&apos;s Place Nursery, an early childhood environment where children
                are encouraged to explore, learn and grow. Proudly established in 1997, we welcome
                families to discover our school and the experiences we offer.
              </p>
              <div className="hero-actions">
                <NavLink className="primary-button" to="/contact">Enquire About Enrolment</NavLink>
                <NavLink className="secondary-button" to="/about">Discover Our School</NavLink>
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-number">29+</div>
                  <div className="hero-stat-label">Years Experience</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-number">1–12</div>
                  <div className="hero-stat-label">Age Range (Years)</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-number">100%</div>
                  <div className="hero-stat-label">Dedicated Care</div>
                </div>
              </div>
            </div>

            <div className="hero-image-card">
              <img
                src="/gallery/WhatsApp Image 2026-10-29 at 10.13.24 (1).jpeg"
                alt="Children smiling at nursery"
              />
              <div className="hero-badge">Est. 1997</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Strip ── */}
      <div className="features-strip">
        <div className="features-strip-inner">
          <div className="feature-strip-item">
            <span className="feature-strip-icon">🌿</span>
            <div className="feature-strip-text">
              <strong>Organic Garden</strong>
              <span>Children help grow, prepare and enjoy fresh vegetables from our premises.</span>
            </div>
          </div>
          <div className="feature-strip-item">
            <span className="feature-strip-icon">🏊</span>
            <div className="feature-strip-text">
              <strong>Swimming & Sport</strong>
              <span>Regular swimming sessions and ball skills activities for all ages.</span>
            </div>
          </div>
          <div className="feature-strip-item">
            <span className="feature-strip-icon">👨‍👩‍👧</span>
            <div className="feature-strip-text">
              <strong>Family Community</strong>
              <span>A welcoming environment with seasonal family events and Connect Days.</span>
            </div>
          </div>
          <div className="feature-strip-item">
            <span className="feature-strip-icon">🛡️</span>
            <div className="feature-strip-text">
              <strong>Safe & Secure</strong>
              <span>A safe, supervised environment where children thrive and grow.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── About Preview ── */}
      <section className="about-section">
        <div className="about-grid">
          <div className="about-images">
            <div className="about-badge-since">
              <strong>1997</strong>
              <span>Est.</span>
            </div>
            <img
              className="about-img-main"
              src="/gallery/WhatsApp Image 2026-10-29 at 10.13.25.jpeg"
              alt="Children playing outdoors"
            />
            <img
              className="about-img-secondary"
              src="/gallery/WhatsApp Image 2026-10-29 at 10.13.27.jpeg"
              alt="Nursery garden activities"
            />
          </div>

          <div className="about-copy">
            <p className="section-label">About Our Nursery</p>
            <h2 className="section-title">Warm, Nurturing &amp; Full of Discovery</h2>
            <p className="section-text" style={{ maxWidth: 'none' }}>
              Sheilagh&apos;s Place Nursery has been part of the Craighall Park community since 1997.
              Our setting is designed to support children as they learn, play and build confidence in
              a safe and welcoming environment.
            </p>

            <ul className="about-list">
              <li className="about-list-item">Day care &amp; pre-school for children aged 1–6 years</li>
              <li className="about-list-item">Aftercare programme for children aged 7–12 years</li>
              <li className="about-list-item">Organic garden grown and maintained by the children</li>
              <li className="about-list-item">Swimming, sport and creative activities throughout the year</li>
            </ul>

            <div className="about-cta-row">
              <NavLink to="/about" className="primary-button">Learn More</NavLink>
              <NavLink to="/contact" className="text-link">Enquire Now</NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Highlights / Services ── */}
      <section className="highlights-section">
        <div className="highlights-header">
          <div className="highlights-header-copy">
            <p className="section-label">School Highlights</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Every Day is an Opportunity to Explore</h2>
          </div>
          <NavLink to="/about" className="btn-outline-accent">View All</NavLink>
        </div>

        <div className="card-grid">
          {highlights.map((item) => (
            <article key={item.title} className="info-card">
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Activities Section ── */}
      <section className="activities-section">
        <div className="container activities-wrap">
          <div className="activities-heading">
            <p className="section-label">Activities</p>
            <h2 className="section-title">Play, Learning &amp; Discovery Every Day</h2>
          </div>

          <div className="activity-grid">
            {activityItems.map((item) => (
              <article key={item.title} className="activity-card">
                <img src={item.image} alt={item.title} />
                <div className="activity-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nature / Garden Section ── */}
      <section className="nature-section">
        <div className="nature-inner">
          <div className="nature-image">
            <img
              src="/gallery/WhatsApp Image 2026-10-29 at 10.13.28.jpeg"
              alt="Children harvesting vegetables in the garden"
            />
          </div>
          <div className="nature-copy">
            <p className="section-label">Our Organic Garden</p>
            <h2 className="section-title">Fresh From Our Garden</h2>
            <p className="section-text">
              At Sheilagh&apos;s Place Nursery, our connection with nature is part of what makes our
              environment so special. Our organic garden is woven into the rhythm of everyday learning,
              helping children explore the world around them through sensory experiences, responsibility,
              and joyful discovery.
            </p>
            <p className="section-text">
              We grow a variety of vegetables on our premises, and the children are actively involved in
              planting, watering, tending, and harvesting. These everyday tasks teach patience,
              care, and respect for nature while giving them a deeper understanding of where food comes from.
            </p>
            <p className="section-text">
              The vegetables grown here are then prepared and enjoyed as part of the children&apos;s daily meals,
              creating a meaningful connection between nature, healthy eating, and the learning experiences
              they share at school each day.
            </p>
            <div className="nature-points" aria-label="Garden activities">
              <span>Planting</span>
              <span>Watering</span>
              <span>Harvesting</span>
              <span>Healthy meals</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <NavLink to="/contact" className="primary-button">Get in Touch</NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="gallery-section">
        <div className="gallery-header">
          <div>
            <p className="section-label">Gallery</p>
            <h2 className="section-title">Moments From Our Nursery</h2>
          </div>

          {galleryItems.length > 3 && (
            <button
              type="button"
              className="gallery-toggle"
              onClick={() => setExpandedGallery((current) => !current)}
            >
              {expandedGallery ? 'Show Less' : 'View More'}
            </button>
          )}
        </div>

        <div className={`gallery-grid ${expandedGallery ? 'gallery-grid-expanded' : ''}`}>
          {visibleGalleryItems.map((image) => (
            <figure key={image.src} className="gallery-item" onClick={() => setSelectedImage(image)} role="button" tabIndex={0} onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setSelectedImage(image)
              }
            }}>
              <img src={image.src} alt={image.alt} />
              <div className="gallery-overlay">🔍</div>
            </figure>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <div className="gallery-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="gallery-close" onClick={() => setSelectedImage(null)} aria-label="Close gallery image">
              Minimise
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
          </div>
        </div>
      )}

      {/* ── Stats / Counter ── */}
      <section className="stats-section">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-icon">😊</span>
            <span className="stat-number">200+</span>
            <span className="stat-label">Happy Children</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎓</span>
            <span className="stat-number">29+</span>
            <span className="stat-label">Years of Excellence</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👨‍👩‍👧</span>
            <span className="stat-number">1–12</span>
            <span className="stat-label">Age Range (Years)</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🌿</span>
            <span className="stat-number">100%</span>
            <span className="stat-label">Dedicated Care</span>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-copy">
            <h2 className="section-title">Ready to Enrol Your Child?</h2>
            <p>Get in touch today and we&apos;ll guide you through the enrolment process.</p>
          </div>
          <NavLink to="/contact" className="btn-cta-white">Enquire About Enrolment</NavLink>
        </div>
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">About Us</p>
          <h1>Our Nurturing Early Childhood Environment</h1>
        </div>
      </div>

      <div className="page-content">
        <div className="program-spotlight">
          <p className="section-label">Our Programme / Age Groups</p>
          <h2>Inclusive Care for Growing Children</h2>
          <div className="programme-grid">
            <div className="programme-item">
              <span>Day Care &amp; Pre-School</span>
              <strong>1 to 6 years</strong>
            </div>
            <div className="programme-item">
              <span>Aftercare</span>
              <strong>7 to 12 years</strong>
            </div>
            <div className="programme-item wide">
              <span>Learning Approach</span>
              <strong>Early learning, safety lessons, emergency service visits, and various recreational and seasonal events.</strong>
            </div>
          </div>
        </div>

        <div className="story-layout">
          <div className="story-copy">
            <p className="section-label">Our Story</p>
            <h2 className="section-title">A School Built on Care &amp; Community</h2>
            <p>
              Sheilagh&apos;s Place Nursery was established in 1997 and has grown into a warm, welcoming
              place where children feel safe, supported and inspired to learn.
            </p>
            <p>
              Our environment encourages children to explore, play and build confidence at their own pace.
              We offer a balanced setting where discovery, routine and creativity all work together.
            </p>
            <p>
              We believe children learn best through meaningful experiences — whether they are learning through
              movement, language, gardening, sensory play or shared family moments in the school community.
            </p>
          </div>

          <div className="story-image-grid">
            <img
              src="/gallery/32506920_2080015738950052_7338211921708974080_n.jpg"
              alt="Children learning from the fire engine visit"
            />
            <img
              src="/gallery/32560327_2080015825616710_2777953549626114048_n.jpg"
              alt="Nursery children and teachers beside the fire truck"
            />
          </div>
        </div>

        <div>
          <p className="section-label">Our Pillars</p>
          <h2 className="section-title">What Makes Us Special</h2>
          <div className="pillars-grid">
            <article>
              <h3>Care &amp; Comfort</h3>
              <p>A nurturing environment where children feel secure and included.</p>
            </article>
            <article>
              <h3>Exploration</h3>
              <p>Opportunities to investigate, create and discover through play.</p>
            </article>
            <article>
              <h3>Nature</h3>
              <p>Organic gardening and outdoor experiences connect children to the natural world.</p>
            </article>
            <article>
              <h3>Activities &amp; Curriculum</h3>
              <p>Early learning, safety lessons, emergency service visits, and seasonal events.</p>
            </article>
            <article>
              <h3>Age Groups</h3>
              <p>Day care and pre-school from 1–6 years; aftercare for children aged 7–12 years.</p>
            </article>
          </div>
        </div>

        <section className="trust-section">
          <div className="trust-header">
            <div>
              <p className="section-label">Trust</p>
              <h2 className="section-title">Families trust Sheilagh&apos;s Place</h2>
            </div>
            <div className="rating-badge">
              <span className="rating-stars">★★★★★</span>
              <span>5.0/5</span>
            </div>
          </div>
          <p className="trust-subtext">Based on 5,07 Google reviews from parents in the community.</p>

          <div className="trust-grid">
            {trustReviews.map((review) => (
              <article key={review.title} className="trust-card">
                <div className="star-row" aria-label="Five star review">★★★★★</div>
                <h3>{review.title}</h3>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-copy">
            <h2 className="section-title">Interested in Joining Our School?</h2>
            <p>We&apos;d love to welcome your family to Sheilagh&apos;s Place Nursery.</p>
          </div>
          <NavLink to="/contact" className="btn-cta-white">Contact Us Today</NavLink>
        </div>
      </section>
    </>
  )
}

function EventsPage() {
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 7, 1))
  const [selectedDate, setSelectedDate] = useState('2026-08-28')

  const eventMap = useMemo(() => {
    const map = new Map()
    initialEvents.forEach((event) => {
      if (!map.has(event.date)) {
        map.set(event.date, [])
      }
      map.get(event.date).push(event)
    })
    return map
  }, [])

  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const firstDayIndex = monthStart.getDay()
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
  const blanks = Array.from({ length: firstDayIndex }, (_, index) => index)
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)

  const selectedDayEvents = eventMap.get(selectedDate) || []

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Events</p>
          <h1>Calendar of School Activities</h1>
        </div>
      </div>

      <div className="page-content">
        <div className="newsletter-box">
          <p className="section-label">Newsletter · 3rd Term</p>
          <h2>Welcome Back to School for the 3rd Term</h2>
          <p>
            Welcome back to school for the 3rd term, I trust you all had a good break and are ready for some exciting times.
          </p>
          <div className="newsletter-points">
            <p><strong>Dates to diary:</strong></p>
            <ul>
              <li>28th August Friday — Spring Picnic</li>
              <li>1st September — Pyjama Day Photos + Bubble Day</li>
              <li>3rd September — Zoo visit</li>
              <li>23rd September — Heritage Day Braai</li>
              <li>24th September — End of 3rd term</li>
            </ul>
          </div>
          <p>
            We will continue with swimming and soccer/ball skills. We will start to collect for staff bonus in September, information to follow.
          </p>
          <p>
            We will be closing on Friday 25th September as it is a school holiday. Our annual connect is on Friday 6th November, information to follow.
          </p>
        </div>

        <div className="calendar-layout">
          <div className="calendar-panel">
            <div className="calendar-header">
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                aria-label="Previous month"
              >
                ‹
              </button>
              <h3>
                {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </h3>
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {blanks.map((blank) => (
                <div key={`blank-${blank}`} className="day empty-day" />
              ))}

              {days.map((day) => {
                const year = calendarMonth.getFullYear()
                const month = String(calendarMonth.getMonth() + 1).padStart(2, '0')
                const dateKey = `${year}-${month}-${String(day).padStart(2, '0')}`
                const hasEvent = eventMap.has(dateKey)

                return (
                  <button
                    type="button"
                    key={dateKey}
                    className={`day ${selectedDate === dateKey ? 'selected' : ''} ${hasEvent ? 'has-event' : ''}`}
                    onClick={() => setSelectedDate(dateKey)}
                  >
                    <span>{day}</span>
                    {hasEvent && <small>•</small>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="event-panel">
            <div className="event-panel-header">
              <h3>{selectedDate}</h3>
              <span className="mini-button" aria-label="School event list is view-only for parents">
                Events
              </span>
            </div>

            {selectedDayEvents.length > 0 ? (
              <ul className="event-list">
                {selectedDayEvents.map((event) => (
                  <li key={event.id} className="event-item">
                    <div>
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No events scheduled for this date yet.</p>
            )}

            <p className="empty-state" style={{ marginTop: '1rem', fontSize: '0.83rem' }}>
              Parents can view upcoming school dates here. The newsletter and events can also be edited by the admin once we set up the backend.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanName = formData.name.trim() || 'Parent'
    const cleanEmail = formData.email.trim()
    const cleanPhone = formData.phone.trim()
    const cleanMessage = formData.message.trim() || 'No message provided.'

    const text = `Hello Sheilagh's Place Nursery,%0A%0A` +
      `Parent name: ${encodeURIComponent(cleanName)}%0A` +
      `Email: ${encodeURIComponent(cleanEmail || 'Not provided')}%0A` +
      `Phone: ${encodeURIComponent(cleanPhone || 'Not provided')}%0A%0A` +
      `Enquiry details:%0A${encodeURIComponent(cleanMessage)}`

    window.open(`https://wa.me/27722344114?text=${text}`, '_blank', 'noopener,noreferrer')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Contact Us</p>
          <h1>Start Your Child&apos;s Nursery Journey</h1>
        </div>
      </div>

      <div className="page-content">
        <div className="contact-page-layout">
          <div className="contact-top-row">
            <div className="contact-card">
              <p className="section-label">Get in Touch</p>
              <h2 className="section-title">We Would Love to Hear From You</h2>

              <div className="contact-item">
                <span>Email</span>
                <a href="mailto:sheilaghcogger@gmail.com">sheilaghcogger@gmail.com</a>
              </div>
              <div className="contact-item">
                <span>Call / WhatsApp</span>
                <a href="tel:+27722344114">+27 72 234 4114</a>
              </div>
              <div className="contact-item">
                <span>Address</span>
                <a href="https://maps.google.com/?q=20 Buckingham Avenue, Craighall Park, Johannesburg, 2196" target="_blank" rel="noreferrer">
                  20 Buckingham Avenue, Craighall Park, Johannesburg, 2196
                </a>
              </div>
              <div className="contact-item">
                <span>Facebook</span>
                <a href="https://www.facebook.com/share/1Keynfw43J/" target="_blank" rel="noreferrer">Visit our page</a>
              </div>
              <div className="contact-item">
                <span>Google</span>
                <a href="https://share.google/lD4xpVs0IL8rVp2ox" target="_blank" rel="noreferrer">View school information</a>
              </div>
              <div className="contact-item">
                <span>WhatsApp</span>
                <a href="https://wa.me/27722344114" target="_blank" rel="noreferrer">Chat with us directly</a>
              </div>
            </div>

            <form className="enquiry-form" onSubmit={handleSubmit}>
              <h3>Send Us an Enquiry</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: '-8px 0 4px' }}>
                Fill in the form and we&apos;ll get back to you as soon as possible.
              </p>
              <label>
                Parent name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+27 00 000 0000"
                  required
                />
              </label>
              <label>
                Enquiry details
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your child and the enrolment information you need."
                  required
                />
              </label>
              <button type="submit" className="primary-button form-button">Send Enquiry</button>
            </form>
          </div>

          <div className="map-panel">
            <iframe
              title="Sheilagh's Place Nursery location"
              src="https://www.google.com/maps?q=20%20Buckingham%20Avenue%2C%20Craighall%20Park%2C%20Johannesburg%2C%202196&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboardPage />
              </Layout>
            </AdminRoute>
          }
        />
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
