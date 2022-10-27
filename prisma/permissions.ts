export const permss = [
  'ADDRESS',
  'READ_ADDRESS',
  'EDIT_ADDRESS',
  'DELETE_ADDRESS',

  'CREATE_BILLING',
  'READ_BILLING',
  'EDIT_BILLING',
  'DELETE_BILLING',

  'CREATE_CAREER',
  'READ_CAREER',
  'EDIT_CAREER',
  'DELETE_CAREER',

  'CREATE_CATEGORY',
  'READ_CATEGORY',
  'EDIT_CATEGORY',
  'DELETE_CATEGORY',

  'CREATE_CHARGE',
  'READ_CHARGE',
  'EDIT_CHARGE',
  'DELETE_CHARGE',

  'CREATE_CLIENT',
  'READ_CLIENT',
  'EDIT_CLIENT',
  'DELETE_CLIENT',

  'CREATE_CONVERSION',
  'READ_CONVERSION',
  'EDIT_CONVERSION',
  'DELETE_CONVERSION',

  'CREATE_CURRENCY',
  'READ_CURRENCY',
  'EDIT_CURRENCY',
  'DELETE_CURRENCY',

  'CREATE_DOCTYPE',
  'READ_DOCTYPE',
  'EDIT_DOCTYPE',
  'DELETE_DOCTYPE',

  'CREATE_OCCUPATION',
  'READ_OCCUPATION',
  'EDIT_OCCUPATION',
  'DELETE_OCCUPATION',

  'CREATE_PARAMETER',
  'READ_PARAMETER',
  'EDIT_PARAMETER',
  'DELETE_PARAMETER',

  'CREATE_PAYMENTMETHOD',
  'READ_PAYMENTMETHOD',
  'EDIT_PAYMENTMETHOD',
  'DELETE_PAYMENTMETHOD',

  'CREATE_PERMISSION',
  'READ_PERMISSION',
  'EDIT_PERMISSION',
  'DELETE_PERMISSION',

  'CREATE_PERSON',
  'READ_PERSON',
  'EDIT_PERSON',
  'DELETE_PERSON',

  'CREATE_PRODUCT',
  'READ_PRODUCT',
  'EDIT_PRODUCT',
  'DELETE_PRODUCT',

  'CREATE_RECEIPT',
  'READ_RECEIPT',
  'EDIT_RECEIPT',
  'DELETE_RECEIPT',

  'CREATE_ROLE',
  'READ_ROLE',
  'EDIT_ROLE',
  'DELETE_ROLE',

  'CREATE_SECRET',
  'READ_SECRET',
  'EDIT_SECRET',
  'DELETE_SECRET',

  'CREATE_SECRETQUESTION',
  'READ_SECRETQUESTION',
  'EDIT_SECRETQUESTION',
  'DELETE_SECRETQUESTION',

  'CREATE_SEMESTER',
  'READ_SEMESTER',
  'EDIT_SEMESTER',
  'DELETE_SEMESTER',

  'CREATE_STUDENT',
  'READ_STUDENT',
  'EDIT_STUDENT',
  'DELETE_STUDENT',

  'CREATE_STUDENTSTATUS',
  'READ_STUDENTSTATUS',
  'EDIT_STUDENTSTATUS',
  'DELETE_STUDENTSTATUS',

  'ACCESS_USERS_MUTATION',
  'CREATE_USER',
  'READ_USER',
  'EDIT_USER',
  'DELETE_USER',

  'CREATE_USERSTATUS',
  'READ_USERSTATUS',
  'EDIT_USERSTATUS',
  'DELETE_USERSTATUS'
]
export const permissionsMoca = permss.map((perm) => {
  const splitedPerm = perm.split('_')

  const permiso = {
    CREATE: 'Crear',
    EDIT: 'Editar',
    READ: 'Leer',
    DELETE: 'Eliminar',
    ACCESS: 'Acceder'
  }
  type Permiso = typeof permiso
  const entidades = {
    ADDRESS: 'Direcciones',
    BILLING: 'Orden',
    CAREER: 'Carrera',
    CATEGORY: 'Categoría',
    CHARGE: 'Cargo',
    CLIENT: 'Cliente',
    CONVERSION: 'Conversión',
    CURRENCY: 'Divisa',
    DOCTYPE: 'Tipo de Documento',
    OCCUPATION: 'Ocupación',
    PARAMETER: 'Parámetro',
    PAYMENTMETHOD: 'Método de pago',
    PERMISSION: 'Permiso',
    PERSON: 'Persona',
    PRODUCT: 'Producto',
    RECEIPT: 'Recibo',
    ROLE: 'Rol',
    SECRET: 'Secrecto',
    SECRETQUESTION: 'Pregunta Secreta',
    SEMESTER: 'Semestre',
    STUDENT: 'Estudiante',
    STUDENTSTATUS: 'Estado del Estudiante',
    USER: 'Usuario',
    USERSTATUS: 'Estado del Usuario'
  }
  type Entidades = typeof entidades
  return {
    permission: perm,
    description: `${permiso[splitedPerm[0] as keyof Permiso]} ${
      splitedPerm[2] ? 'a' : ''
    } la entidad: ${entidades[splitedPerm[1] as keyof Entidades]}`
  }
})
