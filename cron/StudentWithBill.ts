export const StudentWithBill = ({ student, billings, count }: StudentWithBillOptions) => {
  return `<pre>${JSON.stringify({ student, billings, count }, null, 2)}</pre>`
}

type StudentWithBillOptions = {
  student: {
    id: number
    firstName: string
    firstLastName: string
    docNumber: string
    type: string
    career: string
    currentSemester: number
  }
  billings: string
  count: number
}
