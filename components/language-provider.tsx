'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type SiteLanguage = 'en' | 'fa' | 'ps'
const LanguageContext = createContext<{ language: SiteLanguage; setLanguage: (value: SiteLanguage) => void } | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>('en')
  useEffect(() => { const saved = window.localStorage.getItem('kaaj-language') as SiteLanguage | null; if (saved === 'fa' || saved === 'ps') setLanguage(saved) }, [])
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl'
    window.localStorage.setItem('kaaj-language', language)

    const textSources = new WeakMap<Text, string>()
    const attributeSources = new WeakMap<Element, Map<string, string>>()
    const translate = () => {
      const dictionary = siteTranslations[language]
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        const textNode = node as Text
        const source = textSources.get(textNode) ?? textNode.nodeValue ?? ''
        textSources.set(textNode, source)
        const translated = dictionary[source.trim()]
        if (translated) textNode.nodeValue = textNode.nodeValue?.replace(source.trim(), translated) ?? translated
      }
      document.querySelectorAll<HTMLElement>('[placeholder], [aria-label], [title]').forEach((element) => {
        const sources = attributeSources.get(element) ?? new Map<string, string>()
        for (const attribute of ['placeholder', 'aria-label', 'title']) {
          const value = element.getAttribute(attribute)
          if (!value) continue
          const source = sources.get(attribute) ?? value
          sources.set(attribute, source)
          element.setAttribute(attribute, dictionary[source] ?? (language === 'en' ? source : value))
        }
        attributeSources.set(element, sources)
      })
    }
    translate()
    const observer = new MutationObserver(translate)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export const translations = {
  en: { home: 'Home', services: 'Services', doctors: 'Doctors', contact: 'Contact', book: 'Book Appointment', hero: 'Your Smile', deserves: 'Deserves', best: 'the Best.', intro: 'Advanced dental care, modern technology, and personalized treatment — all in one trusted clinic.', bookNow: 'Book an Appointment', explore: 'Explore Services' },
  fa: { home: 'خانه', services: 'خدمات', doctors: 'داکتران', contact: 'تماس', book: 'گرفتن نوبت', hero: 'لبخند شما', deserves: 'شایسته', best: 'بهترین‌هاست.', intro: 'مراقبت پیشرفته دندان، تکنولوژی مدرن و درمان شخصی‌سازی‌شده در یک کلینیک قابل اعتماد.', bookNow: 'گرفتن نوبت', explore: 'مشاهده خدمات' },
  ps: { home: 'کور', services: 'خدمتونه', doctors: 'ډاکټران', contact: 'اړیکه', book: 'د وخت اخیستل', hero: 'ستاسو موسکا', deserves: 'وړ ده', best: 'تر ټولو غوره.', intro: 'پرمختللې د غاښونو پاملرنه، عصري ټکنالوژي او ځانګړې درملنه په یوه باوري کلینیک کې.', bookNow: 'د وخت اخیستل', explore: 'خدمتونه وګورئ' },
} as const

const commonTranslations = {
  'About': 'درباره ما', 'Before & After': 'قبل و بعد', 'Reviews': 'نظرات',
  'Premium Dental & Cosmetic Dentistry — Kabul': 'دندان‌پزشکی پیشرفته و زیبایی — کابل',
  'Our Services': 'خدمات ما', 'Comprehensive care for every smile': 'مراقبت کامل برای هر لبخند',
  'From routine check-ups to full smile transformations, every treatment is delivered with precision, comfort, and an eye for detail.': 'از معاینه‌های معمول تا تغییر کامل لبخند، هر درمان با دقت، آرامش و توجه انجام می‌شود.',
  'Learn More': 'بیشتر بدانید', 'About Kaaj Dental Clinic': 'درباره کلینیک دندان‌پزشکی کاج',
  'Where world-class dentistry meets genuine, personal care.': 'جایی که دندان‌پزشکی در سطح جهانی با مراقبت صمیمی و شخصی همراه می‌شود.',
  'Years of Trusted Care': 'سال‌ها مراقبت قابل اعتماد', 'Modern Equipment': 'تجهیزات مدرن',
  'Experienced Specialists': 'متخصصان باتجربه', 'Patient-Centered Care': 'مراقبت بیمارمحور', 'Trusted Standards': 'استانداردهای قابل اعتماد',
  'The KAAJ Experience': 'تجربه کاج',
  'Our Doctors': 'داکتران ما', 'Care led by experienced hands': 'مراقبت با دستان باتجربه',
  'Meet the dedicated dental professionals caring for every KAAJ smile.': 'با متخصصان متعهدی آشنا شوید که از هر لبخند کاج مراقبت می‌کنند.',
  'Real Patient Stories': 'داستان واقعی بیماران', 'Smiles That Tell a Story': 'لبخندهایی که داستان دارند', 'Watch story': 'تماشای داستان',
  'Real transformations, real confidence': 'تغییر واقعی، اعتمادبه‌نفس واقعی',
  'Patient Stories': 'داستان بیماران', 'Loved by thousands of smiles': 'محبوب هزاران لبخند',
  'Book an Appointment': 'گرفتن نوبت', 'Start Your Smile Journey': 'سفر لبخند خود را آغاز کنید',
  'Full Name': 'نام کامل', 'Phone Number': 'شماره تلفن', 'Preferred Service': 'خدمت مورد نظر',
  'Preferred Date': 'تاریخ مورد نظر', 'Preferred Time': 'زمان مورد نظر', 'Message': 'پیام',
  'Select a service': 'یک خدمت را انتخاب کنید', 'Address': 'آدرس', 'Phone': 'تلفن', 'Email': 'ایمیل', 'Opening Hours': 'ساعات کاری',
  'Explore': 'کاوش', 'Contact': 'تماس', 'Services': 'خدمات', 'All rights reserved.': 'تمام حقوق محفوظ است.',
  'Advanced Dental Care': 'مراقبت پیشرفته دندان', 'Gentle & precise': 'آرام و دقیق', 'Modern Technology': 'تکنولوژی مدرن',
  'Digital diagnostics': 'تشخیص دیجیتال', 'Certified team': 'تیم مجرب',
  'Digital imaging, intraoral scanners, and precision tools for accurate, comfortable care.': 'تصویربرداری دیجیتال، اسکنرهای داخل دهان و ابزارهای دقیق برای مراقبتی راحت و دقیق.',
  'A dedicated team of certified dentists across every field of modern dentistry.': 'تیمی متعهد از داکتران مجرب در تمام بخش‌های دندان‌پزشکی مدرن.',
  'Personalized treatment plans built around your comfort, goals, and wellbeing.': 'برنامه‌های درمانی شخصی‌سازی‌شده بر اساس آرامش، اهداف و سلامت شما.',
  'Rigorous hygiene and international safety protocols on every single visit.': 'رعایت دقیق بهداشت و استانداردهای بین‌المللی ایمنی در هر مراجعه.',
  'Tell us a little about what you need and our team will confirm your preferred time.': 'کمی درباره نیازتان به ما بگویید تا تیم ما زمان مورد نظر شما را تأیید کند.',
  'How can we help?': 'چگونه می‌توانیم کمک کنیم؟', 'Your name': 'نام شما', 'you@example.com': 'you@example.com',
  'Showing sample results for': 'نمایش نمونه نتایج برای', 'Individual results vary.': 'نتایج برای هر فرد متفاوت است.',
  'From Broken': 'از شکسته', 'to Beautiful.': 'تا زیبا.', 'Your smile deserves a second chance.': 'لبخند شما شایسته یک فرصت دوباره است.',
  'Let KAAJ Dental Clinic help restore your smile with modern, precise and compassionate dental care.': 'بگذارید کلینیک دندان‌پزشکی کاج با مراقبت مدرن، دقیق و دلسوزانه لبخند شما را بازسازی کند.',
  'Years of Experience': 'سال تجربه', 'Happy Patients': 'بیماران خوشحال', 'Dental Services': 'خدمات دندان‌پزشکی', 'Patient Rating': 'امتیاز بیماران',
  'Dental Implants': 'ایمپلنت دندان', 'Orthodontics': 'ارتودنسی', 'Veneers': 'لمینت دندان', 'Teeth Whitening': 'سفید کردن دندان',
  'Root Canal Treatment': 'درمان ریشه', 'Dental Crowns': 'روکش دندان', 'Dental Fillings': 'پرکردن دندان', 'Gum Treatment': 'درمان لثه',
  'Pediatric Dentistry': 'دندان‌پزشکی کودکان', 'General Dentistry': 'دندان‌پزشکی عمومی',
  'Sending request...': 'در حال ارسال درخواست...', 'Thank you!': 'تشکر!', 'Previous review': 'نظر قبلی', 'Next review': 'نظر بعدی',
  'Instagram': 'اینستاگرام', 'Facebook': 'فیسبوک', 'Telegram': 'تلگرام', 'Crafted with care in Kabul, Afghanistan.': 'با دقت در کابل، افغانستان ساخته شده است.',
  'Treatment room': 'اتاق درمان', 'Reception lounge': 'سالن پذیرش', 'Waiting lounge': 'سالن انتظار', 'Clinic hallway': 'راهروی کلینیک',
  'Patient Story 01': 'داستان بیمار ۱', 'Patient Story 02': 'داستان بیمار ۲', 'Patient Story 03': 'داستان بیمار ۳',
  'KAAJ Dental Clinic experience': 'تجربه کلینیک دندان‌پزشکی کاج', '5+ years experience': 'بیش از ۵ سال تجربه',
  'Dr. Omar Nazari': 'داکتر عمر نظری', 'Dr. Sahar Amiri': 'داکتر سحر امیری', 'Dr. Yusuf Karimi': 'داکتر یوسف کریمی', 'Dr. Lina Rahimi': 'داکتر لینا رحیمی',
  'Kaaj Dental Clinic was founded on a simple belief: exceptional dental care should feel calm, precise, and deeply personal. From our home in Kabul, we combine advanced technology with the warmth of a team that treats every patient like family.': 'کلینیک دندان‌پزشکی کاج بر این باور ساده بنیان گذاشته شد که مراقبت استثنایی از دندان باید آرام، دقیق و کاملاً شخصی باشد. ما در کابل، تکنولوژی پیشرفته را با گرمای تیمی که با هر بیمار مانند خانواده رفتار می‌کند، ترکیب می‌کنیم.',
  'Our mission': 'ماموریت ما',
  'The most professional dental experience I have ever had. My veneers look completely natural and the whole team made me feel at ease from the first minute.': 'حرفه‌ای‌ترین تجربه دندان‌پزشکی من بود. لمینت‌های من کاملاً طبیعی به نظر می‌رسند و تمام تیم از همان دقیقه اول به من آرامش دادند.',
  'From the modern technology to the calm, elegant environment — Kaaj Dental Clinic truly feels world-class. My implant procedure was completely pain-free.': 'از تکنولوژی مدرن تا محیط آرام و شیک، کلینیک دندان‌پزشکی کاج واقعاً در سطح جهانی است. کاشت ایمپلنت من کاملاً بدون درد بود.',
  'I finally love my smile. The whitening results exceeded my expectations and the doctors explained every step with genuine care.': 'بالاخره لبخندم را دوست دارم. نتیجه سفید کردن دندان فراتر از انتظارم بود و داکتران هر مرحله را با دلسوزی توضیح دادند.',
  'Impeccable service and attention to detail. My daughter actually looks forward to her visits now — the pediatric team is wonderful.': 'خدمات بی‌نقص و توجه عالی به جزئیات. دخترم حالا واقعاً مشتاق مراجعه است؛ تیم دندان‌پزشکی کودکان فوق‌العاده است.',
}

const siteTranslations: Record<SiteLanguage, Record<string, string>> = {
  en: {},
  fa: { ...commonTranslations },
  ps: Object.fromEntries(Object.entries(commonTranslations).map(([key]) => [key, key])),
}

Object.assign(siteTranslations.ps, {
  'About': 'زموږ په اړه', 'Before & After': 'مخکې او وروسته', 'Reviews': 'کتنې',
  'Our Services': 'زموږ خدمتونه', 'Learn More': 'نور معلومات', 'Our Doctors': 'زموږ ډاکټران',
  'Care led by experienced hands': 'د تجربه لرونکو لاسونو پاملرنه', 'Real Patient Stories': 'د ناروغانو ریښتینې کیسې',
  'Watch story': 'کیسه وګورئ', 'Patient Stories': 'د ناروغانو کیسې', 'Book an Appointment': 'وخت واخلئ',
  'Start Your Smile Journey': 'د خپلې موسکا سفر پیل کړئ', 'Full Name': 'بشپړ نوم', 'Phone Number': 'د تلیفون شمېره',
  'Preferred Service': 'غوښتل شوی خدمت', 'Preferred Date': 'غوښتل شوې نېټه', 'Preferred Time': 'غوښتل شوی وخت',
  'Message': 'پیغام', 'Select a service': 'یو خدمت وټاکئ', 'Address': 'پته', 'Phone': 'تلیفون', 'Opening Hours': 'کاري ساعتونه',
  'Explore': 'سپړنه', 'Contact': 'اړیکه', 'Services': 'خدمتونه', 'All rights reserved.': 'ټول حقونه خوندي دي.',
  'Premium Dental & Cosmetic Dentistry — Kabul': 'پرمختللې او ښکلايي غاښونو درملنه — کابل',
  'Comprehensive care for every smile': 'د هرې موسکا لپاره بشپړه پاملرنه',
  'Where world-class dentistry meets genuine, personal care.': 'چېرې چې نړیواله غاښونو درملنه له صمیمي او شخصي پاملرنې سره یوځای کېږي.',
  'The KAAJ Experience': 'د کاج تجربه', 'Where Care Meets Innovation': 'چېرې چې پاملرنه له نوښت سره یوځای کېږي',
  'Smiles That Tell a Story': 'هغه موسکاوې چې کیسه لري', 'Real transformations, real confidence': 'ریښتینی بدلون، ریښتینی باور',
  'From routine check-ups to full smile transformations, every treatment is delivered with precision, comfort, and an eye for detail.': 'له عادي معاینې څخه تر بشپړ بدلون پورې، هره درملنه په دقت، آرامۍ او پاملرنې ترسره کېږي.',
  'Meet the dedicated dental professionals caring for every KAAJ smile.': 'له هغو ژمنو غاښونو متخصصانو سره ووینئ چې د کاج د هرې موسکا پاملرنه کوي.',
  'Advanced Dental Care': 'پرمختللې د غاښونو پاملرنه', 'Gentle & precise': 'نرمه او دقیقه', 'Modern Technology': 'عصري ټکنالوژي',
  'Digital diagnostics': 'ډیجیټل تشخیص', 'Certified team': 'تجربه لرونکی ټیم', 'Dental Implants': 'د غاښونو امپلانټ',
  'Orthodontics': 'اورتودنسي', 'Veneers': 'د غاښونو پوښونه', 'Teeth Whitening': 'د غاښونو سپینول', 'Root Canal Treatment': 'د غاښونو د ریښې درملنه',
  'Dental Crowns': 'د غاښونو تاجونه', 'Dental Fillings': 'د غاښونو ډکول', 'Gum Treatment': 'د وریو درملنه', 'Pediatric Dentistry': 'د ماشومانو د غاښونو درملنه',
  'General Dentistry': 'عمومي غاښونو درملنه', 'Modern Equipment': 'عصري وسایل', 'Patient-Centered Care': 'د ناروغ پر محور پاملرنه',
  'Trusted Standards': 'باوري معیارونه', 'Digital imaging, intraoral scanners, and precision tools for accurate, comfortable care.': 'ډیجیټل انځورونه، دننه‌خولي سکینرونه او دقیق وسایل د هوسا پاملرنې لپاره.',
  'A dedicated team of certified dentists across every field of modern dentistry.': 'د عصري غاښونو درملنې په ټولو برخو کې د ژمنو متخصصانو ټیم.',
  'Personalized treatment plans built around your comfort, goals, and wellbeing.': 'ستاسو د آرامۍ، موخو او روغتیا پر بنسټ ځانګړي درملنیز پلانونه.',
  'Rigorous hygiene and international safety protocols on every single visit.': 'په هره لیدنه کې کلک حفظ‌الصحې او نړیوال خوندیتوب معیارونه.',
  'Tell us a little about what you need and our team will confirm your preferred time.': 'موږ ته د خپلې اړتیا په اړه ووایاست، زموږ ټیم به ستاسو غوښتل شوی وخت تایید کړي.',
  'How can we help?': 'څنګه مرسته درسره وکړو؟', 'Your name': 'ستاسو نوم', 'Showing sample results for': 'د دې لپاره د بېلګې پایلې', 'Individual results vary.': 'پایلې د هر کس لپاره توپیر لري.',
  'Sending request...': 'غوښتنه لېږل کېږي...', 'Thank you!': 'مننه!', 'Previous review': 'مخکینۍ کتنه', 'Next review': 'بله کتنه',
  'Instagram': 'انسټاګرام', 'Facebook': 'فیسبوک', 'Telegram': 'ټیلیګرام', 'Crafted with care in Kabul, Afghanistan.': 'په کابل، افغانستان کې په پاملرنې جوړ شوی.',
  'Treatment room': 'د درملنې خونه', 'Reception lounge': 'د استقبالیې سالون', 'Waiting lounge': 'د انتظار سالون', 'Clinic hallway': 'د کلینیک دهلېز',
  'Patient Story 01': 'د ناروغ کیسه ۱', 'Patient Story 02': 'د ناروغ کیسه ۲', 'Patient Story 03': 'د ناروغ کیسه ۳', 'KAAJ Dental Clinic experience': 'د کاج کلینیک تجربه', '5+ years experience': 'له ۵ کلونو زیاته تجربه',
  'Dr. Omar Nazari': 'ډاکټر عمر نظري', 'Dr. Sahar Amiri': 'ډاکټره سحر امیري', 'Dr. Yusuf Karimi': 'ډاکټر یوسف کریمي', 'Dr. Lina Rahimi': 'ډاکټره لینا رحیمي',
  'Kaaj Dental Clinic was founded on a simple belief: exceptional dental care should feel calm, precise, and deeply personal. From our home in Kabul, we combine advanced technology with the warmth of a team that treats every patient like family.': 'د کاج د غاښونو کلینیک پر دې ساده باور جوړ شوی چې غوره د غاښونو پاملرنه باید ارامه، دقیقه او شخصي وي. موږ په کابل کې عصري ټکنالوژي د داسې ټیم له تودوخې سره یوځای کوو چې له هر ناروغ سره د کورنۍ په څېر چلند کوي.',
  'Our mission': 'زموږ موخه',
  'The most professional dental experience I have ever had. My veneers look completely natural and the whole team made me feel at ease from the first minute.': 'دا زما د غاښونو تر ټولو مسلکي تجربه وه. زما د غاښونو پوښونه ډېر طبیعي ښکاري او ټول ټیم له لومړۍ دقیقې ما آرام احساس کړ.',
  'From the modern technology to the calm, elegant environment — Kaaj Dental Clinic truly feels world-class. My implant procedure was completely pain-free.': 'له عصري ټکنالوژۍ تر ارام او ښکلي چاپېریال پورې، د کاج کلینیک رښتیا هم نړیوال احساس لري. زما د غاښونو امپلانټ په بشپړ ډول بې درده و.',
  'I finally love my smile. The whitening results exceeded my expectations and the doctors explained every step with genuine care.': 'اوس بالاخره خپله موسکا خوښوم. د سپینولو پایلې زما له تمې لوړې وې او ډاکټرانو هر ګام په صمیمي پاملرنې تشریح کړ.',
  'Impeccable service and attention to detail. My daughter actually looks forward to her visits now — the pediatric team is wonderful.': 'بې‌نقصه خدمت او جزئیاتو ته پاملرنه. زما لور اوس خپلو لیدنو ته سترګې په لار وي؛ د ماشومانو ټیم ډېر غوره دی.',
})
