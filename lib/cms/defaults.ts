import { doctors, services } from '@/lib/data'
import type {
  ClinicGalleryItem,
  ClinicSettings,
  ManagedService,
  PatientStory,
  ManagedDoctor,
  ServiceIconName,
} from '@/lib/cms/types'

const serviceIcons: ServiceIconName[] = [
  'Sparkles',
  'Braces',
  'Layers',
  'Sun',
  'HeartPulse',
  'Crown',
  'Shield',
  'Leaf',
  'Baby',
  'Stethoscope',
]

export const defaultServices: ManagedService[] = services.map(
  (service, index) => ({
    id: service.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    name: service.title,
    description: service.description,
    icon: serviceIcons[index] ?? 'Sparkles',
    image: service.image,
    imageAlt: service.imageAlt,
    imagePosition: service.imagePosition,
    active: true,
    sortOrder: index,
  }),
)

export const defaultClinicGallery: ClinicGalleryItem[] = [
  {
    id: 'treatment-room',
   src: '/images/clinic-experience/treatment-room.JPG',
    alt: 'A modern KAAJ Dental Clinic treatment room with a dental chair and clinical equipment',
    label: 'Treatment room',
    objectPosition: '54% 54%',
    active: true,
    sortOrder: 0,
  },
  {
    id: 'reception-lounge',
   src: '/images/clinic-experience/reception-lounge.JPG',
    alt: 'KAAJ Dental Clinic reception lounge with clinic branding, seating, and welcoming decor',
    label: 'Reception lounge',
    objectPosition: '50% 56%',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'waiting-lounge',
    src: '/images/clinic-experience/waiting-area.JPG',
    alt: 'KAAJ Dental Clinic waiting lounge with navy seating and gold-accented tables',
    label: 'Waiting lounge',
    objectPosition: '50% 57%',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'clinic-hallway',
    src: '/images/clinic-experience/clinic-hallway.JPG',
    alt: 'A clean KAAJ Dental Clinic hallway leading to private treatment units',
    label: 'Clinic hallway',
    objectPosition: '50% 44%',
    active: true,
    sortOrder: 3,
  },
]

export const defaultPatientStories: PatientStory[] = [
  {
    id: 'patient-story-01',
    name: 'Patient Story 01',
    treatment: 'KAAJ Dental Clinic experience',
    video: '/videos/patient-stories/patient-story-01.mp4',
    quote: 'A real patient sharing their care journey and experience at KAAJ Dental Clinic.',
    duration: '2:26',
    rating: 5,
    active: true,
    sortOrder: 0,
  },
  {
    id: 'patient-story-02',
    name: 'Patient Story 02',
    treatment: 'KAAJ Dental Clinic experience',
    video: '/videos/patient-stories/patient-story-02.mp4',
    quote: 'Hear this patient reflect on their visit and the care they received.',
    duration: '0:44',
    rating: 5,
    active: true,
    sortOrder: 1,
  },
  {
    id: 'patient-story-03',
    name: 'Patient Story 03',
    treatment: 'KAAJ Dental Clinic experience',
    video: '/videos/patient-stories/patient-story-03.mp4',
    quote: 'A personal account of care, comfort, and confidence at KAAJ Dental Clinic.',
    duration: '1:16',
    rating: 5,
    active: true,
    sortOrder: 2,
  },
]

export const defaultDoctors: ManagedDoctor[] = doctors.map((doctor, index) => ({
  id: doctor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name: doctor.name,
  specialty: doctor.specialty,
  experience: doctor.experience,
  image: doctor.image,
  active: true,
  sortOrder: index,
}))

export const defaultClinicSettings: ClinicSettings = {
  clinicName: 'KAAJ Dental Clinic',
  phone: '+93 700848348-784042121',
  whatsapp: '+93700848348',
  address: 'Khair Khana, Between Golai Park and Golai Khwaja Bughra, Kabul, Afghanistan',
  workingHours: 'Saturday to Thursday, 8:00 AM to 6:00 PM',
  email: '',
  instagram: '',
  facebook: '',
  telegram: '',
  googleMapsUrl:
    'https://www.google.com/maps?q=Khair+Khana,+Kabul,+Afghanistan&output=embed',
}
