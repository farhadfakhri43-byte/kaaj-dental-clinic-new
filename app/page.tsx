import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { ClinicExperience } from '@/components/sections/clinic-experience'
import { Services } from '@/components/sections/services'
import { Doctors } from '@/components/sections/doctors'
import { DoctorDirectory } from '@/components/sections/doctor-directory'
import { BeforeAfter } from '@/components/sections/before-after'
import { Reviews } from '@/components/sections/reviews'
import { PatientStories } from '@/components/sections/patient-stories'
import { Stats } from '@/components/sections/stats'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/sections/footer'
import { ScrollProgress } from '@/components/motion/scroll-progress'
import { CursorGlow } from '@/components/motion/cursor-glow'
import { getPublicContent } from '@/lib/cms/repository'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const content = await getPublicContent()

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <ClinicExperience images={content.gallery} />
        <PatientStories stories={content.patientStories} />
        <Services services={content.services} />
        <DoctorDirectory doctors={content.doctors} />
        <Doctors />
        <BeforeAfter />
        <Stats />
        <Reviews stories={content.patientStories} />
        <Contact services={content.services} settings={content.settings} />
      </main>
      <Footer services={content.services} settings={content.settings} />
    </>
  )
}
