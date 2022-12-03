import { schedule, validate } from 'node-cron'
import updateStudentBillingCron from './updateStudentBillingCron'

export default function scheduleUpdateTask(expression: string) {
  //Validate expression
  if (!validate(expression)) throw new Error(`the expression: ${expression} is invalid.`)

  console.log('ejecutando desde scheduleUpdateTask')

  return schedule(expression, updateStudentBillingCron)
}
