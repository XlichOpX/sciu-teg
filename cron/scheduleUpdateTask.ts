import cronstrue from 'cronstrue'
import 'cronstrue/locales/es'
import { schedule, validate } from 'node-cron'
import updateStudentBillingCron from './updateStudentBillingCron'

export default function scheduleUpdateTask(expression: string) {
  //Validate expression
  if (!validate(expression)) throw new Error(`the expression: ${expression} is invalid.`)

  console.log(
    'Tarea agendada: scheduleUpdateTask',
    cronstrue.toString(expression, { locale: 'es' })
  )

  return schedule(expression, updateStudentBillingCron, { timezone: 'America/caracas' })
}
