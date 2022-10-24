import { Prisma } from '@prisma/client'
import { studentWithPersonCareerAndStatus } from 'prisma/queries'

export type StudentWithPersonCareerAndStatus = Prisma.StudentGetPayload<
  typeof studentWithPersonCareerAndStatus
>

export type StudentWithPersonStatusCareerAndEnrolledSemesters = Prisma.StudentGetPayload<
  typeof studentWithPersonStatusCareerAndEnrolledSemesters
>
