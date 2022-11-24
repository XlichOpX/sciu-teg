import { Semester } from '@prisma/client'
import { semesterCreateSchema, semesterUpdateSchema } from 'schema/semesterSchema'
import { z } from 'zod'

export type Semester = Semester
export type CreateSemesterInput = z.infer<typeof semesterCreateSchema>
export type UpdateSemesterInput = z.infer<typeof semesterUpdateSchema>
