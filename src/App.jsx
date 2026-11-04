import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import './App.css'
import { apiRequest, authClient } from './auth'

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

const defaultNewsletterEntries = [
  {
    id: 1,
    term: '3rd Term 2026',
    title: 'Welcome Back to School for the 3rd Term',
    intro: 'Welcome back to school for the 3rd term, I trust you all had a good break and are ready for some exciting times.',
    points: [
      '28th August Friday — Spring Picnic',
      '1st September — Pyjama Day Photos + Bubble Day',
      '3rd September — Zoo visit',
      '23rd September — Heritage Day Braai',
      '24th September — End of 3rd term',
    ],
    closing: 'We will continue with swimming and soccer/ball skills. We will start to collect for staff bonus in September, information to follow. We will be closing on Friday 25th September as it is a school holiday. Our annual connect is on Friday 6th November, information to follow.',
  },
]

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const CONTENT_POLL_INTERVAL_MS = 8000

const adminStorageKeys = {
  enquiries: 'sheilagh-enquiries',
  events: 'sheilagh-events',
  gallery: 'sheilagh-gallery',
  newsletters: 'sheilagh-newsletters',
  applications: 'sheilagh-applications',
}


function openWhatsAppEnquiry(messageText) {
  const whatsappUrl = `https://wa.me/27722344114?text=${encodeURIComponent(messageText)}`
  const emailUrl = `mailto:sheilaghcogger@gmail.com?subject=${encodeURIComponent('Enquiry from Sheilagh\'s Place website')}&body=${encodeURIComponent(messageText)}`

  try {
    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    if (!popup) {
      window.location.href = emailUrl
    }
  } catch {
    window.location.href = emailUrl
  }
}

function openWhatsAppApplication(messageText) {
  const whatsappUrl = `https://wa.me/27722344114?text=${encodeURIComponent(messageText)}`
  const emailUrl = `mailto:sheilaghcogger@gmail.com?subject=${encodeURIComponent('Online Application from Sheilagh\'s Place website')}&body=${encodeURIComponent(messageText)}`

  try {
    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    if (!popup) {
      window.location.href = emailUrl
    }
  } catch {
    window.location.href = emailUrl
  }
}

function generateApplicationPdf(formData) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 48
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const accentColor = [115, 99, 54]
  let currentY = 98

  const drawDivider = (y) => {
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.8)
    doc.line(margin, y, pageWidth - margin, y)
  }

  const writeSection = (title, fields) => {
    if (currentY > 710) {
      doc.addPage()
      currentY = 80
    }

    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setFillColor(244, 238, 224)
    doc.roundedRect(margin - 8, currentY - 18, pageWidth - margin * 2 + 16, 18, 6, 6, 'F')
    doc.setTextColor(47, 47, 47)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(title, margin, currentY)
    currentY += 20

    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(margin, currentY - 4, pageWidth - margin, currentY - 4)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(46, 46, 46)

    fields.forEach(([label, value]) => {
      const safeValue = value ?? 'Not provided'
      const line = `${label}: ${safeValue}`
      const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2 - 10)

      wrapped.forEach((wrappedLine) => {
        if (currentY > 770) {
          doc.addPage()
          currentY = 80
        }
        doc.text(wrappedLine, margin, currentY)
        currentY += 14
      })
    })

    currentY += 10
  }

  doc.setFillColor(247, 244, 235)
  doc.rect(0, 0, pageWidth, 96, 'F')
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
  doc.line(margin, 96, pageWidth - margin, 96)

  doc.setFillColor(69, 55, 30)
  doc.roundedRect(margin, 18, 42, 42, 10, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('SP', margin + 13, 46)

  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text("Sheilagh's Place Nursery", margin + 58, 34)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Early Learning • Enrolment Application', margin + 58, 52)
  doc.text(`Submitted: ${new Date().toLocaleString()}`, pageWidth - margin - 160, 52)

  currentY = 114

  writeSection('1. Child details', [
    ['Application type', formData.applicationType],
    ['Child name', formData.childName],
    ['Date of birth', formData.dateOfBirth],
    ['Age', formData.childAge],
    ['Gender', formData.gender],
    ['Home language', formData.homeLanguage],
  ])

  writeSection('2. Parent / guardian details', [
    ['Parent / guardian name', formData.parentName],
    ['Email address', formData.email],
    ['Phone number', formData.phone],
    ['Residential address', formData.address],
    ['Employment status', formData.employmentStatus],
  ])

  writeSection('3. Emergency contact', [
    ['Emergency contact name', formData.emergencyName],
    ['Emergency contact phone', formData.emergencyPhone],
    ['Relationship to child', formData.relationship],
  ])

  writeSection('4. Medical and wellbeing information', [
    ['Medical concerns', formData.medicalConcerns],
    ['Allergies', formData.allergies],
    ['Medication', formData.medication],
    ['Medical aid / provider', formData.medicalAid],
    ['Doctor / clinic name', formData.doctor],
    ['Immunisations', formData.immunisations],
  ])

  writeSection('5. Nursery and fee information', [
    ['Preferred start date', formData.startDate],
    ['School fees', formData.schoolFees],
    ['Stationery / requirements', formData.stationery],
    ['Additional comments', formData.comments],
  ])

  if (currentY > 680) {
    doc.addPage()
    currentY = 80
  }

  drawDivider(currentY)
  currentY += 16

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('6. Declaration', margin, currentY)
  currentY += 18

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const declarationText = 'I confirm that the information provided is accurate and that I agree to Sheilagh\'s Place Nursery\'s enrolment procedures, policies, and emergency protocols.'
  const wrappedDeclaration = doc.splitTextToSize(declarationText, pageWidth - margin * 2)

  wrappedDeclaration.forEach((line) => {
    if (currentY > 760) {
      doc.addPage()
      currentY = 80
    }
    doc.text(line, margin, currentY)
    currentY += 14
  })

  const signatureY = Math.min(pageHeight - 70, currentY + 36)
  const signatureX = pageWidth - 180
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
  doc.setLineWidth(1.2)
  doc.line(signatureX, signatureY, signatureX + 120, signatureY)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.text('Parent / guardian signature', signatureX, signatureY + 16)

  doc.setDrawColor(160, 160, 160)
  doc.line(margin, signatureY, margin + 120, signatureY)
  doc.setFont('helvetica', 'normal')
  doc.text('Date', margin, signatureY + 16)

  doc.setFillColor(247, 244, 235)
  doc.rect(0, pageHeight - 32, pageWidth, 32, 'F')
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
  doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32)
  doc.setTextColor(58, 58, 58)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Sheilagh\'s Place Nursery | sheilaghcogger@gmail.com | +27 72 234 4114 | sheilaghsplace.co.za', margin, pageHeight - 15)

  const fileName = `${(formData.childName || 'application').trim().replace(/\s+/g, '-') || 'application'}.pdf`
  const pdfBlob = doc.output('blob')

  return {
    blob: pdfBlob,
    fileName,
    url: URL.createObjectURL(pdfBlob),
  }
}

async function shareApplicationPdf(pdf, messageText) {
  const shareText = messageText

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([pdf.blob], pdf.fileName, { type: 'application/pdf' })] })) {
    const shareFile = new File([pdf.blob], pdf.fileName, { type: 'application/pdf' })

    try {
      await navigator.share({
        title: 'Sheilagh\'s Place Nursery Application',
        text: shareText,
        files: [shareFile],
      })
      return true
    } catch {
      // The user cancelled the share sheet. Keep the PDF available and fall back to a manual delivery path.
    }
  }

  const pdfLink = document.createElement('a')
  pdfLink.href = pdf.url
  pdfLink.download = pdf.fileName
  document.body.appendChild(pdfLink)
  pdfLink.click()
  document.body.removeChild(pdfLink)

  const fallbackMessage = messageText
  openWhatsAppApplication(fallbackMessage)
  setTimeout(() => URL.revokeObjectURL(pdf.url), 15000)
  return false
}

function buildApplicationSummaryText(data) {
  const lines = [
    "Sheilagh's Place Nursery",
    'School Registration Enquiry',
    '',
    'Applicant information',
    `Application type: ${data.applicationType || 'Not provided'}`,
    `Parent / guardian: ${data.parentName || 'Not provided'}`,
    `Email address: ${data.email || 'Not provided'}`,
    `Phone number: ${data.phone || 'Not provided'}`,
    `Residential address: ${data.address || 'Not provided'}`,
    '',
    'Child details',
    `Child name: ${data.childName || 'Not provided'}`,
    `Date of birth: ${data.dateOfBirth || 'Not provided'}`,
    `Age: ${data.childAge || 'Not provided'}`,
    `Gender: ${data.gender || 'Not provided'}`,
    `Home language: ${data.homeLanguage || 'Not provided'}`,
    '',
    'Emergency contact',
    `Emergency contact person: ${data.emergencyName || 'Not provided'}`,
    `Emergency contact number: ${data.emergencyPhone || 'Not provided'}`,
    `Relationship to child: ${data.relationship || 'Not provided'}`,
    '',
    'Medical and welfare information',
    `Medical concerns: ${data.medicalConcerns || 'None noted'}`,
    `Allergies: ${data.allergies || 'None noted'}`,
    `Medication: ${data.medication || 'Not provided'}`,
    `Medical aid / doctor: ${data.medicalAid || 'Not provided'} / ${data.doctor || 'Not provided'}`,
    `Immunisations: ${data.immunisations || 'Not provided'}`,
    '',
    'Nursery and fee information',
    `Preferred start date: ${data.startDate || 'Not provided'}`,
    `School fees: ${data.schoolFees || 'Not provided'}`,
    `Stationery / requirements: ${data.stationery || 'Not provided'}`,
    `Additional comments: ${data.comments || 'None'}`,
  ]

  return lines.join('\n')
}

function hasPlaceholderContent(type, item) {
  if (!item || typeof item !== 'object') {
    return true
  }

  const searchable = [
    item.term,
    item.title,
    item.intro,
    item.message,
    item.childName,
    item.parentName,
    item.email,
    item.name,
    item.src,
    item.alt,
    item.status,
    item.type,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (!searchable.trim()) {
    return true
  }

  const placeholderPatterns = {
    newsletters: [/welcome to 2027/i, /newsletter and calendar to be updated/i, /term 1 2027/i],
    gallery: [/placeholder/i, /facebook-gallery/i],
    enquiries: [/aisha patel/i, /lebo mokoena/i, /example.com/i],
    applications: [/mila patel/i, /aisha patel/i, /example.com/i],
  }

  const patterns = placeholderPatterns[type] ?? []
  return patterns.some((pattern) => pattern.test(searchable)) || (type === 'gallery' && /facebook-gallery/i.test(searchable))
}

async function fetchContentList(type, fallback) {
  try {
    const result = await apiRequest(`/api/content/${type}`)
    const nextItems = Array.isArray(result?.items)
      ? result.items.filter((item) => !hasPlaceholderContent(type, item))
      : []

    const resolved = nextItems.length === 0 ? (Array.isArray(fallback) ? [...fallback] : []) : nextItems
    resolved.success = true
    return resolved
  } catch {
    const failedFallback = Array.isArray(fallback) ? [...fallback] : []
    failedFallback.success = false
    return failedFallback
  }
}

async function saveContentItem(type, payload, method = 'POST', itemId = '') {
  const url = itemId ? `/api/content/${type}/${itemId}` : `/api/content/${type}`
  const result = await apiRequest(url, {
    method,
    body: JSON.stringify(payload),
  })

  return result?.item ?? payload
}

async function removeContentItem(type, itemId) {
  const result = await apiRequest(`/api/content/${type}/${itemId}`, { method: 'DELETE' })
  return result?.deleted ?? true
}

function readStoredList(storageKey, fallback) {
  try {
    const savedValue = window.localStorage.getItem(storageKey)

    if (!savedValue) {
      window.localStorage.setItem(storageKey, JSON.stringify(fallback))
      return fallback
    }

    const parsed = JSON.parse(savedValue)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function isPublished(value) {
  return value !== false
}

function formatUpdatedAt(value) {
  if (!value) {
    return 'Not updated yet'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Not updated yet'
  }

  return date.toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function downloadCsv(filename, rows, columns = []) {
  const availableColumns = Array.from(new Set([
    ...columns,
    ...rows.flatMap((row) => Object.keys(row || {})),
  ]))

  const csvRows = [availableColumns.join(',')]

  rows.forEach((row) => {
    const values = availableColumns.map((column) => {
      const value = row?.[column] ?? ''
      const stringValue = String(value ?? '')
      return `"${stringValue.replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(','))
  })

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

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
  const [enquiries, setEnquiries] = useState([])
  const [events, setEvents] = useState([])
  const [gallery, setGallery] = useState([])
  const [newsletterEntries, setNewsletterEntries] = useState([])
  const [applications, setApplications] = useState([])
  const [auditLog, setAuditLog] = useState(() => readStoredList('sheilagh-audit-log', [
    { id: 1, message: 'Dashboard initialized for school administration', timestamp: new Date().toISOString() },
  ]))
  const [eventForm, setEventForm] = useState({ title: '', date: '', description: '', published: true })
  const [newsletterForm, setNewsletterForm] = useState({ id: null, term: '', title: '', intro: '', points: '', closing: '', published: true })
  const [galleryForm, setGalleryForm] = useState({ src: '', alt: '', published: true })
  const [lastSync, setLastSync] = useState(new Date().toISOString())
  const [accountSettingsForm, setAccountSettingsForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [editingEventId, setEditingEventId] = useState(null)
  const [editingNewsletterId, setEditingNewsletterId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const [adminSettingsOpen, setAdminSettingsOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadContent = async () => {
      try {
        const contentResults = await Promise.all([
          fetchContentList('enquiries', []),
          fetchContentList('events', initialEvents),
          fetchContentList('gallery', galleryItems),
          fetchContentList('newsletters', defaultNewsletterEntries),
          fetchContentList('applications', []),
        ])

        const [nextEnquiries, nextEvents, nextGallery, nextNewsletters, nextApplications] = contentResults

        if (!isMounted) {
          return
        }

        setEnquiries(nextEnquiries)
        setEvents(nextEvents)
        setGallery(nextGallery)
        setNewsletterEntries(nextNewsletters)
        setApplications(nextApplications)

        if (contentResults.every((result) => result.success !== false)) {
          setLastSync(new Date().toISOString())
        }
      } catch {
        if (isMounted) {
          setEnquiries([])
          setEvents(initialEvents)
          setGallery(galleryItems)
          setNewsletterEntries(defaultNewsletterEntries)
          setApplications([])
        }
      }
    }

    loadContent()
    const intervalId = window.setInterval(loadContent, CONTENT_POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const stats = useMemo(() => {
    const newEnquiries = enquiries.filter((item) => item.status === 'new').length
    const reviewedEnquiries = enquiries.filter((item) => item.status === 'reviewed').length
    const contactedEnquiries = enquiries.filter((item) => item.status === 'contacted').length

    const newApplications = applications.filter((item) => item.status === 'new').length
    const liveEvents = events.filter((item) => isPublished(item.published)).length
    const liveGallery = gallery.filter((item) => isPublished(item.published)).length
    const liveNewsletters = newsletterEntries.filter((item) => isPublished(item.published)).length

    return {
      totalEnquiries: enquiries.length,
      newEnquiries,
      reviewedEnquiries,
      contactedEnquiries,
      totalEvents: events.length,
      totalGallery: gallery.length,
      totalNewsletters: newsletterEntries.length,
      totalApplications: applications.length,
      newApplications,
      liveEvents,
      liveGallery,
      liveNewsletters,
      lastAudit: auditLog[0]?.message || 'No activity yet',
    }
  }, [applications, auditLog, enquiries, events, gallery, newsletterEntries])

  const filteredEnquiries = enquiries.filter((item) => filter === 'all' ? true : item.status === filter)

  const persistAudit = (message) => {
    const nextEntry = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
    }

    setAuditLog((current) => {
      const next = [nextEntry, ...current].slice(0, 8)
      window.localStorage.setItem('sheilagh-audit-log', JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    let isMounted = true

    authClient.getSession()
      .then((result) => {
        if (!isMounted) return
        const sessionUser = result?.data?.user ?? null
        setUser(sessionUser)
        if (sessionUser) {
          setAccountSettingsForm((current) => ({
            ...current,
            name: sessionUser.name || '',
            email: sessionUser.email || '',
          }))
        }
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

  const handleAccountSettingsChange = (event) => {
    const { name, value } = event.target
    setAccountSettingsForm((current) => ({ ...current, [name]: value }))
  }

  const handleAccountSettingsSubmit = async (event) => {
    event.preventDefault()

    const name = accountSettingsForm.name.trim()
    const email = accountSettingsForm.email.trim().toLowerCase()

    if (!name || !email) {
      setStatusMessage('Please enter an admin display name and login email.')
      return
    }

    if (!accountSettingsForm.currentPassword) {
      setStatusMessage('Please enter your current password to update the admin login.')
      return
    }

    if (accountSettingsForm.newPassword && accountSettingsForm.newPassword.length < 8) {
      setStatusMessage('The new password must be at least 8 characters long.')
      return
    }

    if (accountSettingsForm.newPassword && accountSettingsForm.newPassword !== accountSettingsForm.confirmPassword) {
      setStatusMessage('The new password and confirmation do not match.')
      return
    }

    const result = await authClient.updateAccount({
      currentPassword: accountSettingsForm.currentPassword,
      newPassword: accountSettingsForm.newPassword || undefined,
      email,
      name,
    })

    if (result?.error) {
      setStatusMessage(result.error.message || 'Unable to update admin login details.')
      return
    }

    const updatedUser = result?.data?.user ?? user
    setUser(updatedUser)
    setStatusMessage('Admin login details updated successfully.')
    persistAudit(`Admin account updated for ${updatedUser.email}`)
    setAccountSettingsForm((current) => ({
      ...current,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }))
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate('/admin/login', { replace: true })
  }

  const handleExportList = (collectionName, rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      setStatusMessage(`No ${collectionName} available to export yet.`)
      return
    }

    const csvRows = rows.map((row) => ({
      ...row,
      submittedAt: row.submittedAt || row.updatedAt || '',
      published: row.published === false ? 'Draft' : 'Live',
    }))

    const exportColumns = [
      'id', 'name', 'email', 'phone', 'status', 'submittedAt', 'updatedAt',
      'message', 'childName', 'parentName', 'published', 'title', 'term',
      'intro', 'closing', 'alt', 'src', 'date', 'type',
    ]

    const filename = `${collectionName}-${new Date().toISOString().slice(0, 10)}.csv`
    downloadCsv(filename, csvRows, exportColumns)
    setStatusMessage(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} exported as a CSV file.`)
  }

  const handleReviewEnquiry = async (id) => {
    const target = enquiries.find((enquiry) => enquiry.id === id)
    if (!target) {
      return
    }

    const flow = ['new', 'reviewed', 'contacted', 'archived', 'new']
    const currentIndex = flow.indexOf(target.status || 'new')
    const nextStatus = flow[(currentIndex + 1) % flow.length]

    try {
      const response = await apiRequest(`/api/content/enquiries/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      })

      const updated = enquiries.map((enquiry) => {
        if (enquiry.id !== id) {
          return enquiry
        }

        return { ...enquiry, ...(response?.item || {}), status: nextStatus }
      })

      setEnquiries(updated)
      persistAudit('Enquiry status updated')
    } catch {
      const updated = enquiries.map((enquiry) => (
        enquiry.id === id ? { ...enquiry, status: nextStatus } : enquiry
      ))
      setEnquiries(updated)
      persistAudit('Enquiry status updated')
    }
  }

  const handleEventChange = (event) => {
    const { name, value } = event.target
    setEventForm((current) => ({ ...current, [name]: value }))
  }

  const handleEventSubmit = async (event) => {
    event.preventDefault()

    if (!eventForm.title || !eventForm.date || !eventForm.description) {
      setStatusMessage('Please complete the title, date and description before saving the event.')
      return
    }

    const payload = {
      id: editingEventId ?? Date.now(),
      title: eventForm.title.trim(),
      date: eventForm.date,
      description: eventForm.description.trim(),
      published: isPublished(eventForm.published),
      updatedAt: new Date().toISOString(),
    }

    try {
      const savedItem = await saveContentItem('events', payload, editingEventId ? 'PUT' : 'POST', editingEventId ? String(editingEventId) : '')
      const nextEvents = editingEventId
        ? events.map((entry) => (entry.id === editingEventId ? savedItem : entry))
        : [...events, savedItem].sort((left, right) => new Date(left.date) - new Date(right.date))

      setEvents(nextEvents)
      setEventForm({ title: '', date: '', description: '', published: true })
      setEditingEventId(null)
      setStatusMessage(editingEventId ? 'School event updated successfully.' : 'School event added successfully.')
      persistAudit(editingEventId ? `Event edited: ${savedItem.title}` : `Event added: ${savedItem.title}`)
      setLastSync(new Date().toISOString())
    } catch {
      setStatusMessage('Unable to save the school event right now. Please try again.')
    }
  }

  const handleEditEvent = (entry) => {
    setEditingEventId(entry.id)
    setEventForm({
      title: entry.title,
      date: entry.date,
      description: entry.description,
      published: isPublished(entry.published),
    })
    setStatusMessage('Editing existing school event.')
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      await removeContentItem('events', String(eventId))
      const nextEvents = events.filter((entry) => entry.id !== eventId)
      setEvents(nextEvents)
      persistAudit('Event removed from the school calendar')
      setStatusMessage('School event removed.')
    } catch {
      setStatusMessage('Unable to delete the selected school event.')
    }

    if (editingEventId === eventId) {
      setEditingEventId(null)
      setEventForm({ title: '', date: '', description: '', published: true })
    }
  }

  const handleNewsletterChange = (event) => {
    const { name, value } = event.target
    setNewsletterForm((current) => ({ ...current, [name]: value }))
  }

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()

    const term = newsletterForm.term.trim()
    const title = newsletterForm.title.trim()
    const intro = newsletterForm.intro.trim()
    const points = newsletterForm.points
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean)
    const closing = newsletterForm.closing.trim()

    if (!term || !title || !intro || points.length === 0 || !closing) {
      setStatusMessage('Please complete the term, title, intro, points and closing note for the newsletter.')
      return
    }

    const payload = {
      id: editingNewsletterId ?? Date.now(),
      term,
      title,
      intro,
      points,
      closing,
      published: isPublished(newsletterForm.published),
      updatedAt: new Date().toISOString(),
    }

    try {
      const savedItem = await saveContentItem('newsletters', payload, editingNewsletterId ? 'PUT' : 'POST', editingNewsletterId ? String(editingNewsletterId) : '')
      const nextNewsletterEntries = editingNewsletterId
        ? newsletterEntries.map((entry) => (entry.id === editingNewsletterId ? savedItem : entry))
        : [savedItem, ...newsletterEntries]

      setNewsletterEntries(nextNewsletterEntries)
      setNewsletterForm({ id: null, term: '', title: '', intro: '', points: '', closing: '', published: true })
      setEditingNewsletterId(null)
      setStatusMessage(editingNewsletterId ? 'Newsletter updated successfully.' : 'Newsletter added successfully.')
      persistAudit(editingNewsletterId ? `Newsletter updated: ${savedItem.title}` : `Newsletter added: ${savedItem.title}`)
      setLastSync(new Date().toISOString())
    } catch {
      setStatusMessage('Unable to save the newsletter right now. Please try again.')
    }
  }

  const handleEditNewsletter = (entry) => {
    setEditingNewsletterId(entry.id)
    setNewsletterForm({
      id: entry.id,
      term: entry.term,
      title: entry.title,
      intro: entry.intro,
      points: entry.points.join('\n'),
      closing: entry.closing,
      published: isPublished(entry.published),
    })
    setStatusMessage('Editing existing newsletter.')
  }

  const handleDeleteNewsletter = async (newsletterId) => {
    try {
      await removeContentItem('newsletters', String(newsletterId))
      const nextNewsletterEntries = newsletterEntries.filter((entry) => entry.id !== newsletterId)
      setNewsletterEntries(nextNewsletterEntries)
      persistAudit('Newsletter removed from the school updates')
      setStatusMessage('Newsletter removed.')
    } catch {
      setStatusMessage('Unable to delete the selected newsletter.')
    }

    if (editingNewsletterId === newsletterId) {
      setEditingNewsletterId(null)
      setNewsletterForm({ id: null, term: '', title: '', intro: '', points: '', closing: '', published: true })
    }
  }

  const handleGalleryChange = (event) => {
    const { name, value } = event.target
    setGalleryForm((current) => ({ ...current, [name]: value }))
  }

  const handleGalleryFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please choose an image file for the gallery.')
      return
    }

    const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setStatusMessage('Please upload a gallery image smaller than 2MB for best performance.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const suggestedAlt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'School gallery image'

      setGalleryForm((current) => ({
        ...current,
        src: result,
        alt: current.alt || suggestedAlt,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleGallerySubmit = async (event) => {
    event.preventDefault()

    const src = galleryForm.src.trim()
    const alt = galleryForm.alt.trim()

    if (!src || !alt) {
      setStatusMessage('Please upload an image and add an alt description.')
      return
    }

    try {
      const savedItem = await saveContentItem('gallery', {
        id: Date.now(),
        src,
        alt,
        published: isPublished(galleryForm.published),
        updatedAt: new Date().toISOString(),
      }, 'POST')
      setGallery((current) => [savedItem, ...current])
      setGalleryForm({ src: '', alt: '', published: true })
      setStatusMessage('Gallery content updated.')
      persistAudit(`Gallery image added: ${alt}`)
      setLastSync(new Date().toISOString())
    } catch {
      setStatusMessage('Unable to add the new gallery image right now.')
    }
  }

  const handleGalleryDelete = async (index) => {
    const item = gallery[index]
    if (!item) {
      return
    }

    try {
      await removeContentItem('gallery', String(item.id ?? index))
      const nextGallery = gallery.filter((_, itemIndex) => itemIndex !== index)
      setGallery(nextGallery)
      setStatusMessage('Gallery item removed.')
      persistAudit('Gallery image removed')
    } catch {
      setStatusMessage('Unable to remove the selected gallery item.')
    }
  }

  const handleGalleryPublish = async (item) => {
    if (!item) {
      return
    }

    try {
      const nextItem = {
        ...item,
        published: true,
        updatedAt: new Date().toISOString(),
      }

      const savedItem = await saveContentItem('gallery', nextItem, 'PUT', String(item.id ?? ''))
      const nextGallery = gallery.map((entry) => (entry.id === savedItem.id || entry.src === item.src ? { ...entry, ...savedItem, published: true } : entry))
      setGallery(nextGallery)
      setStatusMessage('Gallery item published.')
      persistAudit(`Gallery image published: ${savedItem.alt || 'item'}`)
    } catch {
      setStatusMessage('Unable to publish the selected gallery item.')
    }
  }

  const handleGalleryMove = (index, direction) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= gallery.length) {
      return
    }

    const nextGallery = [...gallery]
    ;[nextGallery[index], nextGallery[nextIndex]] = [nextGallery[nextIndex], nextGallery[index]]
    setGallery(nextGallery)
    persistAudit('Gallery order updated')
  }

  const handleGalleryRefresh = async () => {
    const nextGallery = [...gallery]
    const available = galleryItems.filter((item) => !nextGallery.some((entry) => entry.src === item.src))
    const freshItem = available[0] || galleryItems[0]

    if (!freshItem) {
      return
    }

    try {
      const savedItem = await saveContentItem('gallery', {
        id: Date.now(),
        ...freshItem,
        alt: `${freshItem.alt} (Updated)`,
        published: true,
        updatedAt: new Date().toISOString(),
      }, 'POST')

      const updatedGallery = [savedItem, ...nextGallery]
      setGallery(updatedGallery)
      setStatusMessage('Gallery content refreshed.')
      persistAudit('Gallery refreshed with a new item')
    } catch {
      setStatusMessage('Unable to refresh the gallery content right now.')
    }
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

      <div className="admin-summary-grid">
        <div className="admin-card summary-card">
          <span>New enquiries</span>
          <strong>{stats.newEnquiries}</strong>
        </div>
        <div className="admin-card summary-card">
          <span>Reviewed</span>
          <strong>{stats.reviewedEnquiries}</strong>
        </div>
        <div className="admin-card summary-card">
          <span>Live events</span>
          <strong>{stats.liveEvents}</strong>
        </div>
        <div className="admin-card summary-card">
          <span>Live gallery</span>
          <strong>{stats.liveGallery}</strong>
        </div>
        <div className="admin-card summary-card">
          <span>Live newsletters</span>
          <strong>{stats.liveNewsletters}</strong>
        </div>
        <div className="admin-card summary-card">
          <span>Applications</span>
          <strong>{stats.totalApplications}</strong>
        </div>
      </div>

      <div className="admin-sync-bar">
        <span>Last sync: {formatUpdatedAt(lastSync)}</span>
        <button type="button" className="secondary-button tiny-button" onClick={() => handleExportList('applications', applications)}>Export applications</button>
        <button type="button" className="secondary-button tiny-button" onClick={() => handleExportList('enquiries', enquiries)}>Export enquiries</button>
      </div>

      <div className="admin-grid">
        <div className="admin-card admin-panel-block wide-card">
          <div className="admin-section-header">
            <h2>Admin login settings</h2>
            <button
              type="button"
              className="admin-toggle-button"
              onClick={() => setAdminSettingsOpen((current) => !current)}
              aria-expanded={adminSettingsOpen}
            >
              {adminSettingsOpen ? 'Hide' : 'Change'}
            </button>
          </div>

          {adminSettingsOpen && (
            <form className="admin-event-form" onSubmit={handleAccountSettingsSubmit}>
              <label>
                Display name
                <input type="text" name="name" value={accountSettingsForm.name} onChange={handleAccountSettingsChange} placeholder="School admin" required />
              </label>
              <label>
                Login email
                <input type="email" name="email" value={accountSettingsForm.email} onChange={handleAccountSettingsChange} placeholder="admin@school.com" required />
              </label>
              <label>
                Current password
                <input type="password" name="currentPassword" value={accountSettingsForm.currentPassword} onChange={handleAccountSettingsChange} placeholder="Enter your current password" required />
              </label>
              <label>
                New password (optional)
                <input type="password" name="newPassword" value={accountSettingsForm.newPassword} onChange={handleAccountSettingsChange} placeholder="Leave empty to keep the current password" />
              </label>
              <label>
                Confirm new password
                <input type="password" name="confirmPassword" value={accountSettingsForm.confirmPassword} onChange={handleAccountSettingsChange} placeholder="Re-enter the new password" />
              </label>
              <button type="submit" className="primary-button">Update admin login</button>
            </form>
          )}
        </div>

        <div className="admin-card admin-panel-block wide-card">
          <div className="admin-section-header">
            <h2>Review enquiry messages</h2>
            <button type="button" className="secondary-button tiny-button" onClick={() => handleExportList('enquiries', enquiries)}>Export CSV</button>
          </div>
          <div className="admin-filter-row">
            {['all', 'new', 'reviewed', 'contacted', 'archived'].map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-chip ${filter === option ? 'is-active' : ''}`}
                onClick={() => setFilter(option)}
              >
                {option === 'all' ? 'All' : option}
              </button>
            ))}
          </div>

          {filteredEnquiries.length === 0 ? (
            <p>No enquiries match this status.</p>
          ) : (
            <div className="admin-list">
              {filteredEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="admin-list-item">
                  <div>
                    <strong>{enquiry.name}</strong>
                    <p>{enquiry.email}</p>
                    <p>{enquiry.phone}</p>
                    <p>{enquiry.message}</p>
                    <small>{new Date(enquiry.submittedAt).toLocaleString()}</small>
                  </div>
                  <div className="admin-list-actions">
                    <span className={`status-pill status-${enquiry.status || 'new'}`}>{enquiry.status || 'new'}</span>
                    <button type="button" className="advance-status-button" onClick={() => handleReviewEnquiry(enquiry.id)}>
                      {enquiry.status === 'archived' ? 'Reset' : 'Advance status'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card admin-panel-block wide-card">
          <div className="admin-section-header">
            <h2>Online applications</h2>
            <button type="button" className="secondary-button tiny-button" onClick={() => handleExportList('applications', applications)}>Export CSV</button>
          </div>
          {applications.length === 0 ? (
            <p>No online applications have been submitted yet.</p>
          ) : (
            <div className="admin-list">
              {applications.map((application) => (
                <div key={application.id} className="admin-list-item">
                  <div>
                    <strong>{application.childName || 'Unnamed child'}</strong>
                    <p><span className="application-detail-label">Type:</span> {application.applicationType || 'Not specified'}</p>
                    <p><span className="application-detail-label">Parent:</span> {application.parentName || application.name || 'Not provided'}</p>
                    <p><span className="application-detail-label">Contact:</span> {application.email || 'No email'} · {application.phone || 'No phone'}</p>
                    <p><span className="application-detail-label">Medical:</span> {application.medicalConcerns || 'No allergy or medical notes provided'}</p>
                    <small>{new Date(application.submittedAt || Date.now()).toLocaleString()}</small>
                  </div>
                  <div className="admin-list-actions">
                    <span className={`status-pill status-${application.status || 'new'}`}>{application.status || 'new'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card admin-panel-block">
          <h2>Update school events</h2>
          <form className="admin-event-form" onSubmit={handleEventSubmit}>
            <label>
              Event title
              <input type="text" name="title" value={eventForm.title} onChange={handleEventChange} placeholder="School picnic" required />
            </label>
            <label>
              Event date
              <input type="date" name="date" value={eventForm.date} onChange={handleEventChange} required />
            </label>
            <label>
              Description
              <textarea name="description" value={eventForm.description} onChange={handleEventChange} rows="4" placeholder="Add event details..." required />
            </label>
            <label className="admin-publish-toggle">
              <input
                type="checkbox"
                checked={eventForm.published}
                onChange={(event) => setEventForm((current) => ({ ...current, published: event.target.checked }))}
              />
              Publish to the public site
            </label>
            <button type="submit" className="primary-button">{editingEventId ? 'Save event changes' : 'Add event'}</button>
            {editingEventId && (
              <button type="button" className="secondary-button" onClick={() => {
                setEditingEventId(null)
                setEventForm({ title: '', date: '', description: '', published: true })
              }}>
                Cancel edit
              </button>
            )}
          </form>
          {statusMessage && <p className="admin-status-message">{statusMessage}</p>}

          <div className="admin-mini-list">
            {events.map((entry) => (
              <div key={entry.id} className="admin-mini-item">
                <div className="admin-event-summary">
                  <span className="event-date-badge">
                    {new Date(`${entry.date}T12:00:00`).toLocaleDateString('en-ZA', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.description}</p>
                    <small>{isPublished(entry.published) ? 'Live' : 'Draft'} · Updated {formatUpdatedAt(entry.updatedAt)}</small>
                  </div>
                </div>
                <div className="mini-item-actions">
                  <button type="button" className="secondary-button tiny-button" onClick={() => handleEditEvent(entry)}>Edit</button>
                  <button type="button" className="secondary-button tiny-button" onClick={() => handleDeleteEvent(entry.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card admin-panel-block">
          <h2>Manage newsletter</h2>
          <form className="admin-event-form" onSubmit={handleNewsletterSubmit}>
            <label>
              Newsletter term
              <input type="text" name="term" value={newsletterForm.term} onChange={handleNewsletterChange} placeholder="3rd Term" required />
            </label>
            <label>
              Title
              <input type="text" name="title" value={newsletterForm.title} onChange={handleNewsletterChange} placeholder="Welcome Back to School" required />
            </label>
            <label>
              Intro
              <textarea name="intro" value={newsletterForm.intro} onChange={handleNewsletterChange} rows="3" placeholder="Write the opening message..." required />
            </label>
            <label>
              Diary points
              <textarea name="points" value={newsletterForm.points} onChange={handleNewsletterChange} rows="5" placeholder={'28th August Friday — Spring Picnic\n1st September — Pyjama Day'} required />
            </label>
            <label>
              Closing note
              <textarea name="closing" value={newsletterForm.closing} onChange={handleNewsletterChange} rows="3" placeholder="Add your closing message..." required />
            </label>
            <label className="admin-publish-toggle">
              <input
                type="checkbox"
                checked={newsletterForm.published}
                onChange={(event) => setNewsletterForm((current) => ({ ...current, published: event.target.checked }))}
              />
              Publish to the public site
            </label>
            <button type="submit" className="primary-button">{editingNewsletterId ? 'Save newsletter' : 'Add newsletter'}</button>
            {editingNewsletterId && (
              <button type="button" className="secondary-button" onClick={() => {
                setEditingNewsletterId(null)
                setNewsletterForm({ id: null, term: '', title: '', intro: '', points: '', closing: '', published: true })
              }}>
                Cancel edit
              </button>
            )}
          </form>

          <div className="admin-mini-list">
            {newsletterEntries.map((entry) => (
              <div key={entry.id} className="admin-mini-item">
                <div className="admin-event-summary">
                  <span className="event-date-badge">{entry.term}</span>
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.intro}</p>
                    <small>{isPublished(entry.published) ? 'Live' : 'Draft'} · Updated {formatUpdatedAt(entry.updatedAt)}</small>
                  </div>
                </div>
                <div className="mini-item-actions">
                  <button type="button" className="secondary-button tiny-button" onClick={() => handleEditNewsletter(entry)}>Edit</button>
                  <button type="button" className="secondary-button tiny-button" onClick={() => handleDeleteNewsletter(entry.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card admin-panel-block">
          <h2>Refresh gallery content</h2>
          <form className="admin-gallery-form" onSubmit={handleGallerySubmit}>
            <label>
              Upload image
              <input type="file" accept="image/*" onChange={handleGalleryFileSelect} />
              {galleryForm.src && (
                <div className="gallery-upload-preview">
                  <img src={galleryForm.src} alt="Selected gallery upload preview" />
                </div>
              )}
            </label>
            <label>
              Alt text
              <input type="text" name="alt" value={galleryForm.alt} onChange={handleGalleryChange} placeholder="Children playing outdoors" required />
            </label>
            <label className="admin-publish-toggle">
              <input
                type="checkbox"
                checked={galleryForm.published}
                onChange={(event) => setGalleryForm((current) => ({ ...current, published: event.target.checked }))}
              />
              Publish to the public site
            </label>
            <button type="submit" className="primary-button">Add gallery image</button>
          </form>
          <button type="button" className="secondary-button" onClick={handleGalleryRefresh}>Refresh gallery</button>

          <div className="admin-gallery-list">
            {gallery.map((item, index) => (
              <div key={`${item.src}-${index}`} className="gallery-row">
                <img src={item.src} alt={item.alt} />
                <div className="gallery-row-meta">
                  <strong>{item.alt}</strong>
                  <small>{isPublished(item.published) ? 'Live' : 'Draft'} · Updated {formatUpdatedAt(item.updatedAt)}</small>
                  <div className="gallery-row-actions">
                    {!isPublished(item.published) && (
                      <button type="button" className="secondary-button tiny-button" onClick={() => handleGalleryPublish(item)}>Publish</button>
                    )}
                    <button type="button" className="secondary-button tiny-button" onClick={() => handleGalleryMove(index, -1)}>↑</button>
                    <button type="button" className="secondary-button tiny-button" onClick={() => handleGalleryMove(index, 1)}>↓</button>
                    <button type="button" className="secondary-button tiny-button" onClick={() => handleGalleryDelete(index)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card admin-panel-block wide-card">
          <h2>Activity log</h2>
          <div className="admin-activity-list">
            {auditLog.map((entry) => (
              <div key={entry.id} className="activity-entry">
                <strong>{entry.message}</strong>
                <small>{new Date(entry.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [applyHue, setApplyHue] = useState(18)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setApplyHue(Math.floor(Math.random() * 360))
    }, 1100)

    return () => window.clearInterval(intervalId)
  }, [])

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
              <NavLink to="/application">Application</NavLink>
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

      <NavLink
        className="apply-float"
        to="/application"
        aria-label="Apply to Sheilagh's Place Nursery"
        style={{ '--apply-button-hue': `${applyHue}` }}
      >
        Apply
      </NavLink>
    </div>
  )
}

function HomePage() {
  const [expandedGallery, setExpandedGallery] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryFeed, setGalleryFeed] = useState(galleryItems)

  useEffect(() => {
    let isMounted = true

    const loadGallery = async () => {
      try {
        const items = await fetchContentList('gallery', galleryItems)
        if (isMounted) {
          setGalleryFeed(items.filter((item) => isPublished(item.published)))
        }
      } catch {
        if (isMounted) {
          setGalleryFeed(galleryItems.filter((item) => isPublished(item.published)))
        }
      }
    }

    loadGallery()
    const intervalId = window.setInterval(loadGallery, CONTENT_POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const visibleGalleryItems = expandedGallery ? galleryFeed : galleryFeed.slice(0, 3)

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
              <span>We grow our own vegetables on the premises to incorporate fresh, wholesome produce into the children&apos;s daily meals.</span>
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
              <li className="about-list-item">Fresh organic vegetables grown on our premises and served in daily meals</li>
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
              loading="lazy"
              decoding="async"
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

          {galleryFeed.length > 3 && (
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
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
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
            <img src={selectedImage.src} alt={selectedImage.alt} loading="eager" decoding="async" />
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
          <div className="cta-actions-row">
            <NavLink to="/application" className="btn-cta-white">Application Form</NavLink>
            <NavLink to="/contact" className="btn-cta-white secondary-cta">Enquire About Enrolment</NavLink>
          </div>
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
              src="/gallery/32560327_2080015825616710_2777953549626114048_n.jpg"
              alt="Nursery children and teachers beside the fire truck"
              loading="lazy"
              decoding="async"
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

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function EventsPage() {
  const today = new Date()
  const initialMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const [calendarMonth, setCalendarMonth] = useState(initialMonth)
  const [selectedDate, setSelectedDate] = useState(formatDateKey(today))
  const [events, setEvents] = useState([])
  const [newsletterEntries, setNewsletterEntries] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadPublicContent = async () => {
      try {
        const [nextEvents, nextNewsletters] = await Promise.all([
          fetchContentList('events', initialEvents),
          fetchContentList('newsletters', defaultNewsletterEntries),
        ])

        if (!isMounted) {
          return
        }

        setEvents(nextEvents.filter((item) => isPublished(item.published)))
        setNewsletterEntries(nextNewsletters.filter((item) => isPublished(item.published)))
      } catch {
        if (isMounted) {
          setEvents(initialEvents.filter((item) => isPublished(item.published)))
          setNewsletterEntries(defaultNewsletterEntries.filter((item) => isPublished(item.published)))
        }
      }
    }

    loadPublicContent()
    const intervalId = window.setInterval(loadPublicContent, CONTENT_POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const eventMap = useMemo(() => {
    const map = new Map()
    events.forEach((event) => {
      if (!map.has(event.date)) {
        map.set(event.date, [])
      }
      map.get(event.date).push(event)
    })
    return map
  }, [events])

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
        {newsletterEntries.map((newsletter) => (
          <div className="newsletter-box" key={newsletter.id}>
            <p className="section-label">Newsletter · {newsletter.term}</p>
            <h2>{newsletter.title}</h2>
            <p>{newsletter.intro}</p>
            {newsletter.points?.length > 0 && (
              <div className="newsletter-points">
                <p><strong>Dates to diary:</strong></p>
                <ul>
                  {newsletter.points.map((point) => (
                    <li key={`${newsletter.id}-${point}`}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {newsletter.closing && <p>{newsletter.closing}</p>}
          </div>
        ))}

        <div className="calendar-layout">
          <div className="calendar-panel">
            <div className="calendar-header">
              <button
                type="button"
                onClick={() => {
                  const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                  setCalendarMonth(nextMonth)
                  const firstOfMonth = formatDateKey(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1))
                  setSelectedDate((current) => eventMap.has(current) && current.startsWith(`${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-`) ? current : firstOfMonth)
                }}
                aria-label="Previous month"
              >
                ‹
              </button>
              <h3>
                {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </h3>
              <button
                type="button"
                onClick={() => {
                  const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                  setCalendarMonth(nextMonth)
                  const firstOfMonth = formatDateKey(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1))
                  setSelectedDate((current) => eventMap.has(current) && current.startsWith(`${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-`) ? current : firstOfMonth)
                }}
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

function ApplicationPage() {
  const initialForm = {
    applicationType: 'Full-time Daycare',
    childName: '',
    dateOfBirth: '',
    childAge: '',
    gender: '',
    homeLanguage: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    employmentStatus: '',
    emergencyName: '',
    emergencyPhone: '',
    relationship: '',
    medicalConcerns: '',
    allergies: '',
    medication: '',
    medicalAid: '',
    doctor: '',
    immunisations: '',
    schoolFees: '',
    stationery: '',
    startDate: '',
    comments: '',
    agreement: false,
  }

  const [formData, setFormData] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [generatedPdf, setGeneratedPdf] = useState(null)

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value
    setFormData((current) => ({ ...current, [name]: nextValue }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    const cleanData = {
      ...formData,
      childName: formData.childName.trim(),
      parentName: formData.parentName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      emergencyName: formData.emergencyName.trim(),
      medicalConcerns: formData.medicalConcerns.trim() || 'None noted',
      allergies: formData.allergies.trim() || 'None noted',
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    if (!cleanData.childName || !cleanData.parentName || !cleanData.email || !cleanData.phone || !cleanData.agreement) {
      setStatus('error')
      setMessage('Please complete the required fields and confirm the declaration before submitting.')
      return
    }

    try {
      const payload = {
        id: Date.now(),
        ...cleanData,
      }

      try {
        await apiRequest('/api/content/applications', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      } catch {
        const existing = readStoredList(adminStorageKeys.applications, [])
        window.localStorage.setItem(adminStorageKeys.applications, JSON.stringify([payload, ...existing]))
      }

      const pdf = generateApplicationPdf(cleanData)
      setGeneratedPdf({ ...cleanData, pdf })
      setFormData(initialForm)
      setStatus('success')
      setMessage('Your application has been submitted successfully. A PDF has been generated and is ready to share. Use Send details to WhatsApp to open the nursery chat directly, or use Share PDF to choose a delivery method from the share sheet.')
    } catch {
      setStatus('error')
      setMessage('Your application could not be sent right now. Please try again or contact the school directly.')
    }
  }

  const handleShareGeneratedPdf = async () => {
    if (!generatedPdf?.pdf) {
      setMessage('No PDF is available to share yet. Please submit the application first.')
      return
    }

    const messageText = buildApplicationSummaryText(generatedPdf)
    const shared = await shareApplicationPdf(generatedPdf.pdf, messageText)

    if (shared) {
      setMessage('Your PDF is ready and shared from the app. You can also download it again if you need to send it another way.')
    } else {
      setMessage('Your application PDF has been downloaded. Please attach it manually in WhatsApp or send it by email if needed.')
    }
  }

  const handleSendToSchoolWhatsApp = () => {
    if (!generatedPdf) {
      setMessage('Please submit the application first so the nursery can receive the form details.')
      return
    }

    const messageText = buildApplicationSummaryText(generatedPdf)
    openWhatsAppApplication(messageText)
    setMessage('The nursery WhatsApp chat has been opened.')
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Application</p>
          <h1>Online Enrolment Form</h1>
        </div>
      </div>

      <div className="page-content application-page-shell">
        <div className="application-card">
          <p className="section-label">Nursery registration</p>
          <h2 className="section-title">Application for admission</h2>
          <p className="application-intro">
            Complete the form below and we will contact you about the next steps in the enrolment process.
          </p>

          <form className="application-form" onSubmit={handleSubmit}>
            <div className="application-form-grid">
              <label>
                Application type
                <select name="applicationType" value={formData.applicationType} onChange={handleChange}>
                  <option>Full-time Daycare</option>
                  <option>Pre-School</option>
                  <option>Aftercare</option>
                  <option>Holiday Care</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Preferred start date
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
              </label>

              <label>
                Child's full name
                <input type="text" name="childName" value={formData.childName} onChange={handleChange} placeholder="Child's full name" required />
              </label>

              <label>
                Date of birth
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              </label>

              <label>
                Age
                <input type="text" name="childAge" value={formData.childAge} onChange={handleChange} placeholder="e.g. 4 years" />
              </label>

              <label>
                Gender
                <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Male / Female / Other" />
              </label>

              <label>
                Home language
                <input type="text" name="homeLanguage" value={formData.homeLanguage} onChange={handleChange} placeholder="Home language" />
              </label>

              <label>
                Parent / guardian name
                <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Parent or guardian" required />
              </label>

              <label>
                Email address
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
              </label>

              <label>
                Phone number
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+27 00 000 0000" required />
              </label>

              <label>
                Address
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" />
              </label>

              <label>
                Employment status
                <input type="text" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} placeholder="Working / studying / retired" />
              </label>

              <label>
                Emergency contact name
                <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="Emergency contact" />
              </label>

              <label>
                Emergency contact number
                <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="+27 00 000 0000" />
              </label>

              <label>
                Relationship to child
                <input type="text" name="relationship" value={formData.relationship} onChange={handleChange} placeholder="Parent / grandparent / aunt / uncle" />
              </label>

              <label>
                Medical aid / scheme
                <input type="text" name="medicalAid" value={formData.medicalAid} onChange={handleChange} placeholder="Medical aid name" />
              </label>

              <label>
                Doctor / clinic name
                <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} placeholder="Doctor or clinic" />
              </label>

              <label className="full-width">
                Medical / allergy information
                <textarea name="medicalConcerns" value={formData.medicalConcerns} onChange={handleChange} rows="4" placeholder="Please list allergies, chronic conditions, or special medical notes." />
              </label>

              <label className="full-width">
                Allergies / medications
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="3" placeholder="List any allergies, medications, or treatment instructions." />
              </label>

              <label className="full-width">
                Medication instructions
                <textarea name="medication" value={formData.medication} onChange={handleChange} rows="3" placeholder="Medication instructions, if applicable." />
              </label>

              <label className="full-width">
                Immunisation information
                <textarea name="immunisations" value={formData.immunisations} onChange={handleChange} rows="3" placeholder="Upload or describe immunisation history." />
              </label>

              <label>
                School fees / deposit information
                <input type="text" name="schoolFees" value={formData.schoolFees} onChange={handleChange} placeholder="Deposit / fee arrangement" />
              </label>

              <label>
                Stationery / uniform details
                <input type="text" name="stationery" value={formData.stationery} onChange={handleChange} placeholder="Stationery or uniform requirements" />
              </label>

              <label className="full-width">
                Additional comments
                <textarea name="comments" value={formData.comments} onChange={handleChange} rows="4" placeholder="Any other details we should know?" />
              </label>
            </div>

            <div className="application-agreement">
              <label className="checkbox-row">
                <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} required />
                <span>
                  I confirm that the information above is correct and agree to the nursery policies, indemnity,
                  emergency procedures and daily care arrangements described by Sheilagh&apos;s Place Nursery.
                </span>
              </label>
            </div>

            {message && (
              <p className={`application-status ${status === 'error' ? 'error' : status === 'success' ? 'success' : ''}`}>
                {message}
              </p>
            )}

            <div className="application-actions">
              <button type="submit" className="primary-button" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
              </button>

              {generatedPdf?.pdf && (
                <>
                  <button type="button" className="secondary-button" onClick={handleSendToSchoolWhatsApp}>
                    Send details to WhatsApp
                  </button>
                  <button type="button" className="secondary-button" onClick={handleShareGeneratedPdf}>
                    Share PDF
                  </button>
                </>
              )}
            </div>
          </form>
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const cleanName = formData.name.trim() || 'Parent'
    const cleanEmail = formData.email.trim()
    const cleanPhone = formData.phone.trim()
    const cleanMessage = formData.message.trim() || 'No message provided.'
    const text = [
      "Dear Sheilagh's Place Nursery,",
      '',
      'Enrolment Enquiry',
      '',
      `Parent / guardian name: ${cleanName}`,
      `Email address: ${cleanEmail || 'Not provided'}`,
      `Phone number: ${cleanPhone || 'Not provided'}`,
      '',
      'Enquiry details:',
      cleanMessage,
    ].join('\n')

    try {
      await apiRequest('/api/content/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          id: Date.now(),
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          message: cleanMessage,
          status: 'new',
          submittedAt: new Date().toISOString(),
        }),
      })

      openWhatsAppEnquiry(text)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch {
      const enquiries = readStoredList(adminStorageKeys.enquiries, [])
      const nextEnquiries = [{
        id: Date.now(),
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        message: cleanMessage,
        status: 'new',
        submittedAt: new Date().toISOString(),
      }, ...enquiries]

      window.localStorage.setItem(adminStorageKeys.enquiries, JSON.stringify(nextEnquiries))
      openWhatsAppEnquiry(text)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }
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
        <Route path="/application" element={<Layout><ApplicationPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
