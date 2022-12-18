export const StudentWithBill = ({ student, billings, count }: StudentWithBillOptions) => {
  return `
  <article>
    <h2>
    ${student.type}-${student.docNumber}: ${student.firstName} ${student.firstLastName},
    ${student.career}, ${student.currentSemester}° semestre
    </h2>
    <p>Deudas generadas (${count}):</p>
    <ul>
      ${billings.map((billing) => `<li>${billing}</li>`).join('')}
    </ul>
  </article>
  `
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
  billings: string[]
  count: number
}
