import cronstrue from 'cronstrue'
import 'cronstrue/locales/es'
import { schedule, validate } from 'node-cron'
import updateConversionCron from './updateConversionCron'
export default function scheduleConversionTask(expression: string) {
  //Validate expression
  if (!validate(expression)) throw new Error(`the expression: ${expression} is invalid.`)

  console.log(
    'Tarea agendada: updateConversionCron',
    cronstrue.toString(expression, { locale: 'es' })
  )

  return schedule(expression, updateConversionCron, { timezone: 'America/caracas' })
}
