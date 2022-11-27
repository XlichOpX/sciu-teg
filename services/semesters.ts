import { Prisma, Semester } from '@prisma/client'
import dayjs from 'dayjs'
import { fetch } from 'lib/fetch'
import { CreateSemesterInput, UpdateSemesterInput } from 'types/semester'

export const getSemesters = async () => {
  return (await fetch('/api/semester')) as Semester[]
}

export async function updateSemester(id: number, data: UpdateSemesterInput) {
  const body: Prisma.SemesterUpdateInput = {
    ...data,
    startDate: dayjs(data.startDate).toDate(),
    endDate: dayjs(data.endDate).toDate()
  }

  await fetch(`/api/semester/${id}`, {
    method: 'PUT',
    body
  })
}

export async function createSemester(data: CreateSemesterInput) {
  const body: Prisma.SemesterCreateInput = {
    ...data,
    startDate: dayjs(data.startDate).toDate(),
    endDate: dayjs(data.endDate).toDate()
  }

  return await fetch('/api/semester', { method: 'POST', body })
}

export async function deleteSemester(id: number) {
  return await fetch(`/api/semester/${id}`, { method: 'DELETE' })
}
