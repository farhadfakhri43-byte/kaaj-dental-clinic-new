import {
  Sparkles,
  Braces,
  Layers,
  Sun,
  HeartPulse,
  Crown,
  Shield,
  Leaf,
  Baby,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'

export type Service = {
  title: string
  description: string
  icon: LucideIcon
  image: string
  imageAlt: string
  imagePosition: string
}

export const services: Service[] = [
  {
    title: 'Dental Implants',
    description: 'Permanent, natural-looking tooth replacement using premium titanium implants.',
    icon: Sparkles,
    image: '/images/services/dental-implants.jpg',
    imageAlt: 'Dental implant model showing a replacement tooth',
    imagePosition: '50% 55%',
  },
  {
    title: 'Orthodontics',
    description: 'Discreet braces and clear aligners that gently perfect your alignment.',
    icon: Braces,
    image: '/images/services/orthodontics.jpg',
    imageAlt: 'Dental model used for orthodontic treatment planning',
    imagePosition: '50% 56%',
  },
  {
    title: 'Veneers',
    description: 'Ultra-thin porcelain veneers crafted for a flawless, luminous smile.',
    icon: Layers,
    image: '/images/services/veneers.jpg',
    imageAlt: 'Patient selecting the shade for cosmetic veneers',
    imagePosition: '58% 50%',
  },
  {
    title: 'Teeth Whitening',
    description: 'Advanced whitening that removes stains for a brighter, radiant finish.',
    icon: Sun,
    image: '/images/services/teeth-whitening.jpg',
    imageAlt: 'Close-up of a bright and healthy smile',
    imagePosition: '50% 54%',
  },
  {
    title: 'Root Canal Treatment',
    description: 'Pain-free endodontic care that preserves and protects your natural teeth.',
    icon: HeartPulse,
    image: '/images/services/root-canal-treatment.jpg',
    imageAlt: 'Tooth anatomy model used to explain root canal treatment',
    imagePosition: '50% 54%',
  },
  {
    title: 'Dental Crowns',
    description: 'Custom-fit ceramic crowns that restore strength, function, and beauty.',
    icon: Crown,
    image: '/images/services/dental-crowns.jpg',
    imageAlt: 'Dental crown and implant held by gloved hands',
    imagePosition: '50% 62%',
  },
  {
    title: 'Dental Fillings',
    description: 'Tooth-colored composite fillings that blend seamlessly and last.',
    icon: Shield,
    image: '/images/services/dental-fillings.jpg',
    imageAlt: 'Illustration of dental restorative fillings placed in a molar',
    imagePosition: '50% 58%',
  },
  {
    title: 'Gum Treatment',
    description: 'Gentle periodontal therapy for healthy gums and a lasting foundation.',
    icon: Leaf,
    image: '/images/services/gum-treatment.jpg',
    imageAlt: 'Dentist providing gentle gum treatment with dental instruments',
    imagePosition: '52% 58%',
  },
  {
    title: 'Pediatric Dentistry',
    description: 'Warm, playful care that builds healthy habits for growing smiles.',
    icon: Baby,
    image: '/images/services/pediatric-dentistry.jpg',
    imageAlt: 'Young patient smiling during a dental shade consultation',
    imagePosition: '44% 58%',
  },
  {
    title: 'General Dentistry',
    description: 'Comprehensive check-ups and preventive care for the whole family.',
    icon: Stethoscope,
    image: '/images/services/general-dentistry.jpg',
    imageAlt: 'Patient receiving routine dental treatment',
    imagePosition: '50% 54%',
  },
]

export type Doctor = {
  name: string
  specialty: string
  experience: string
  image: string
}

export const doctors: Doctor[] = [
  {
    name: 'Dr. Ali ',
    specialty: '',
    experience: '5+ years experience',
    image: '/images/doctor-1.png',
  },
  {
    name: 'Dr. Bashir',
    specialty: '',
    experience: '5+ years experience',
    image: '/images/doctor-2.png',
  },
  {
    name: 'Dr. Emal',
    specialty: '',
    experience: '5+ years experience',
    image: '/images/doctor-3.png',
  },
  {
    name: '',
    specialty: '',
    experience: '',
    image: '',
  },
]

export type Review = {
  name: string
  rating: number
  quote: string
  image: string
  treatment: string
}

export const reviews: Review[] = [
  {
    name: 'Fatima H.',
    rating: 5,
    quote:
      'The most professional dental experience I have ever had. My veneers look completely natural and the whole team made me feel at ease from the first minute.',
    image: '/images/patient-1.png',
    treatment: 'Porcelain Veneers',
  },
  {
    name: 'Ahmad R.',
    rating: 5,
    quote:
      'From the modern technology to the calm, elegant environment — Kaaj Dental Clinic truly feels world-class. My implant procedure was completely pain-free.',
    image: '/images/patient-2.png',
    treatment: 'Dental Implant',
  },
  {
    name: 'Maryam K.',
    rating: 5,
    quote:
      'I finally love my smile. The whitening results exceeded my expectations and the doctors explained every step with genuine care.',
    image: '/images/patient-3.png',
    treatment: 'Teeth Whitening',
  },
  {
    name: 'Karim S.',
    rating: 5,
    quote:
      'Impeccable service and attention to detail. My daughter actually looks forward to her visits now — the pediatric team is wonderful.',
    image: '/images/patient-4.png',
    treatment: 'Family Dentistry',
  },
]

export type Stat = {
  value: number
  suffix: string
  label: string
  decimals?: number
}

export const stats: Stat[] = [
  { value: 5, suffix: '+', label: 'Years of Experience' },
  { value: 3000, suffix: '+', label: 'Happy Patients' },
  { value: 5, suffix: '+', label: 'Dental Services' },
  { value: 4.9, suffix: '/5', label: 'Patient Rating', decimals: 1 },
]

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Before & After', href: '#before-after' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]
