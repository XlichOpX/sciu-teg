import { z } from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      switch (issue.expected) {
        case 'string':
          return { message: 'Debe ser una cadena de caractéres' }
        case 'number':
          return { message: 'Debe ser un número' }
        case 'integer':
          return { message: 'Debe ser un número entero' }
        case 'date':
          return { message: 'Debe ser una fecha' }
      }
      break

    case z.ZodIssueCode.too_small:
      switch (issue.type) {
        case 'string':
          return {
            message: `Debe tener al menos ${issue.minimum} ${
              issue.minimum === 1 ? 'caracter' : 'caractéres'
            }`
          }

        case 'number':
          return {
            message: `Debe ser mayor${issue.inclusive ? 'o igual' : ''} a ${issue.minimum}`
          }
      }
      break

    case z.ZodIssueCode.too_big:
      switch (issue.type) {
        case 'string':
          return {
            message: `Debe tener menos de ${issue.maximum} ${
              issue.maximum === 1 ? 'caracter' : 'caractéres'
            }`
          }

        case 'number':
          return {
            message: `Debe ser menor${issue.inclusive ? 'o igual' : ''} a ${issue.maximum}`
          }
      }
      break
  }
  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)
