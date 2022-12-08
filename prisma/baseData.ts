export const CATEGORIES = [
  {
    name: 'Taller de FOC',
    description: 'Talleres de Formación Complementaria',
    products: [
      { name: 'Taller: Venciendo a la Tímidez' },
      { name: 'Taller: Cuando el Producto Soy Yo' },
      { name: 'Taller: Presentaciones Electrónicas Efectivas' },
      { name: 'Taller: Sígueme y te Sigo' },
      { name: 'Taller: Versos Prosas y Poesías' },
      { name: 'Taller: Conociendo el niño en su Desarrollo Evolutivo' },
      { name: 'Taller de Teatro' },
      { name: 'Taller de Lenguaje de Señas' },
      { name: 'Taller de Álgebra' },
      { name: 'Taller de Excel Avanzado' },
      { name: 'Taller de AutoCAD' },
      { name: 'Taller de Contabilidad' }
    ]
  },
  {
    name: 'Cursos CEP',
    description: 'Cursos de Extensión Profesional',
    products: [
      { name: 'Curso: Mantenimiento y Reparación de PC' },
      { name: 'Curso: Buenas Prácticas en Excel' },
      { name: 'Curso: Diseño para no diseñadores' },
      { name: 'Curso: Instalaciones Eléctricas Residenciales' }
    ]
  },
  {
    name: 'Constancias',
    description: 'Constancias de diversa índole',
    products: [
      { name: 'Constancia de Culminación de Estudios' },
      { name: 'Constancia de Servicio Comunitario' },
      { name: 'Constancia de Horarios Firmados y Sellados' },
      { name: 'Constancia de Estudios' },
      { name: 'Constancia de Pasantías' },
      { name: 'Constancia de Autenticación de Notas/Título' },
      { name: 'Constancia de Buena Conducta' },
      { name: 'Constancia de Notas Certificadas' },
      { name: 'Constancia de Puesto en la Promoción' },
      { name: 'Constancia de Horas Académicas' },
      { name: 'Constancia de Acta de Grado' },
      { name: 'Constancia de Modalidad de Estudio' },
      { name: 'Constancia de Mínimo Aprobatorio' },
      { name: 'Constancia de Tramitación de Título' },
      { name: 'Constancia de Asistencia a Socialización TEG' },
      { name: 'Constancia de Asistencia a Talleres ' },
      { name: 'Constancia de Asistencia a Asesorías de TEG' },
      { name: 'Constancia de Asistencia a Reuniones' },
      { name: 'Constancia de Participación/Apoyo Logística de TEG' },
      { name: 'Constancia de Asistencia a Convivencias' },
      { name: 'Constancia de Inscripción' }
    ]
  },
  {
    name: 'Formatos',
    description: 'Formatos predefinidos para procesos',
    products: [
      { name: 'Hoja de Graduandos' },
      { name: 'Planilla de Reincorporación/Retiro de Semestre' },
      { name: 'Planilla de Inscripción/Retiro de Materia' }
    ]
  },
  {
    name: 'Matrícula',
    description: 'Todo lo relacionado a la matriculación',
    products: [
      { name: 'Mensualidad' },
      { name: 'Recargo por retardo' },
      { name: 'Cambio de carrera' },
      { name: 'Equivalencia de carrera' },
      { name: 'Reincorporación' },
      { name: 'Propedéutico' },
      { name: 'Derecho de Inscripción' }
    ]
  },
  {
    name: 'Grado',
    description: 'Todo lo relacionado a graduandos',
    products: [
      { name: 'Permiso de Acto de Grado' },
      { name: 'Solicitud de Acto de Grado por Secretaría' },
      { name: 'Paquete de constancias para graduandos' },
      { name: 'Paquete de Grado' },
      { name: 'Petición de grado' }
    ]
  }
]

export const STUDENT_STATUS = [
  'Matriculado',
  'Retiro temporal',
  'Retiro definitvo',
  'Egresado',
  'Inasistente',
  'Pendiente de reingreso'
]

export const CAREERS = [
  'Informática',
  'Contabilidad',
  'Administración',
  'Electrotecnia',
  'Electrónica',
  'Educación'
]

export const DOCUMENT_TYPES = ['CV', 'CE', 'PP', 'RIF']

export const CURRENCIES = [
  { name: 'Bolívar', symbol: 'Bs', conversion: 13.19 },
  { name: 'Euro', symbol: '€', conversion: 0.98 },
  { name: 'Dólar', symbol: '$', conversion: 1 }
]

export const PAYMENT_METHODS = [
  {
    name: 'Tarjeta',
    description: 'Tarjetas de débito/crédito nacionales',
    currencies: ['Bolívar']
  },
  {
    name: 'Transferencia',
    description: 'Transferencias desde bancos nacionales',
    currencies: ['Bolívar'],
    metaPayment: [{ name: 'referencia', fieldType: 'string' }]
  },
  {
    name: 'Efectivo',
    description: 'Efectivo en moneda nacional o divisas',
    currencies: ['Bolívar', 'Dólar', 'Euro']
  },
  { name: 'Pago móvil', description: 'Pago móvil desde bancos nacionales', currencies: ['Bolívar'] }
]

export const SECRET_QUESTIONS = [
  'Primer nombre de tu madre',
  'Segundo apellido de tu padre',
  'Nombre de tu mascota favorita',
  'Color del caballo blanco de Simón Bolivar',
  'Nombre de tu primera escuela'
]

export const ROLES = [
  {
    name: 'Analista',
    description: 'Capacidad para ver informes',
    permissions: [
      'READ_SEMESTER',
      'READ_RECEIPT',
      'READ_PRODUCT',
      'READ_CATEGORY',
      'READ_PAYMENTMETHOD',
      'READ_CURRENCY',
      'READ_CONVERSION',
      'READ_PARAMETER',
      'READ_REPORT'
    ]
  },
  {
    name: 'Cajero',
    description: 'Persona encargada de cobrar a estudiantes y clientes',
    permissions: [
      'CREATE_PERSON',
      'READ_PERSON',
      'READ_STUDENT',
      'CREATE_CLIENT',
      'READ_CLIENT',
      'CREATE_OCCUPATION',
      'READ_OCCUPATION',
      'READ_SEMESTER',
      'READ_DOCTYPE',
      'CREATE_ADDRESS',
      'READ_ADDRESS',
      'CREATE_RECEIPT',
      'READ_RECEIPT',
      'READ_PRODUCT',
      'READ_CATEGORY',
      'READ_PAYMENTMETHOD',
      'READ_CURRENCY',
      'READ_CONVERSION',
      'READ_PARAMETER',
      'CREATE_BILLING',
      'READ_REPORT'
    ]
  },
  {
    name: 'Supervisor',
    description: 'Capacidad para alterar las variables del sistema.',
    permissions: [
      'CREATE_PRODUCT',
      'READ_PRODUCT',
      'DELETE_PRODUCT',
      'EDIT_PRODUCT',
      'CREATE_CATEGORY',
      'READ_CATEGORY',
      'DELETE_CATEGORY',
      'EDIT_CATEGORY',
      'CREATE_PAYMENTMETHOD',
      'READ_PAYMENTMETHOD',
      'DELETE_PAYMENTMETHOD',
      'EDIT_PAYMENTMETHOD',
      'CREATE_CURRENCY',
      'READ_CURRENCY',
      'DELETE_CURRENCY',
      'EDIT_CURRENCY',
      'CREATE_CONVERSION',
      'READ_CONVERSION',
      'DELETE_CONVERSION',
      'EDIT_CONVERSION',
      'READ_PARAMETER',
      'EDIT_PARAMETER'
    ]
  }
]
