import { apiSuccess, errorResponse, readJson, requireAdmin } from '@/lib/admin/api'
import { assetUrlValue, stringValue } from '@/lib/admin/validation'
import { deleteDoctor, updateDoctor } from '@/lib/cms/repository'

export const runtime = 'nodejs'

function doctorInput(body: Record<string, unknown>) {
  return {
    name: stringValue(body.name, 'Doctor name', { min: 2, max: 120 }),
    specialty: stringValue(body.specialty, 'Specialty', { min: 2, max: 160 }),
    experience: stringValue(body.experience, 'Experience', { min: 2, max: 80 }),
    image: assetUrlValue(body.image, 'Doctor image'),
    active: body.active !== false,
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request, true)
  if (guard) return guard
  const body = await readJson(request)
  if (!body) return errorResponse(new Error('Invalid request body.'))
  try { return apiSuccess({ doctor: await updateDoctor((await context.params).id, doctorInput(body)) }) } catch (error) { return errorResponse(error) }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request, true)
  if (guard) return guard
  try { return apiSuccess({ doctor: await deleteDoctor((await context.params).id) }) } catch (error) { return errorResponse(error) }
}