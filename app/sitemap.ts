import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://kaajdentalclinic.com'
  const now = new Date()
  const sections = ['', '#about', '#services', '#doctors', '#before-after', '#reviews', '#contact']

  return sections.map((section) => ({
    url: `${base}/${section}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: section === '' ? 1 : 0.8,
  }))
}
