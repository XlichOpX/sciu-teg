const entities = {
  PERSON: 'Personas',
  STUDENT: 'Estudiantes',
  CLIENT: 'Clientes',
  OCCUPATION: 'Ocupaciones',
  STUDENTSTATUS: 'Estados de estudiante',
  ENROLLMENT: 'Inscripciones',
  SEMESTER: 'Semestres',
  CAREER: 'Carreras',
  DOCTYPE: 'Tipos de documento',
  ADDRESS: 'Direcciones',
  RECEIPT: 'Recibos',
  PRODUCT: 'Productos',
  CATEGORY: 'Categorías',
  CHARGE: 'Cobros',
  PAYMENTMETHOD: 'Métodos de pago',
  CURRENCY: 'Divisas',
  CONVERSION: 'Tasas de cambio',
  PARAMETER: 'Parámetros',
  USER: 'Usuarios',
  SECRET: 'Secretos',
  USERSTATUS: 'Estados de usuario',
  ROLE: 'Roles',
  PERMISSION: 'Permisos',
  BILLING: 'Deudas',
  SECRETQUESTION: 'Preguntas secretas'
} as const
type Entity = keyof typeof entities

const operations = {
  CREATE: 'Crear',
  READ: 'Leer',
  DELETE: 'Eliminar',
  EDIT: 'Editar'
} as const
type Operation = keyof typeof operations

export const permissions = Object.keys(entities).flatMap((entity) =>
  Object.keys(operations).map((operation) => ({
    permission: `${operation}_${entity}`,
    description: `${operations[operation as Operation]}: ${entities[entity as Entity]}`
  }))
)

permissions.push(
  { permission: 'ACCESS_USERS_MUTATION', description: 'Modificar usuarios' },
  { permission: 'READ_REPORT', description: 'Leer informes' }
)
