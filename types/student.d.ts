import { Prisma } from '@prisma/client'
import {
  studentWithPersonCareerAndStatus,
  studentWithPersonStatusCareerAndEnrolledSemesters
} from 'prisma/queries'

export type StudentWithPersonCareerAndStatus = Prisma.StudentGetPayload<
  typeof studentWithPersonCareerAndStatus
>

export type StudentWithPersonStatusCareerAndEnrolledSemesters = Prisma.StudentGetPayload<
  typeof studentWithPersonStatusCareerAndEnrolledSemesters
>
