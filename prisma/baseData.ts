import { BOLIVAR, DOLLAR, MATRICULADO } from '../utils/constants'

export const CATEGORIES = [
  {
    name: 'Taller de FOC',
    description: 'Talleres de Formación Complementaria',
    products: [
      { name: 'Taller: Venciendo a la Timidez', stock: 120, price: 15 },
      { name: 'Taller: Cuando el Producto Soy Yo', stock: 120, price: 15 },
      { name: 'Taller: Presentaciones Electrónicas Efectivas', stock: 120, price: 15 },
      { name: 'Taller: Sígueme y te Sigo', stock: 120, price: 15 },
      { name: 'Taller: Versos Prosas y Poesías', stock: 120, price: 15 },
      { name: 'Taller: Conociendo el niño en su Desarrollo Evolutivo', stock: 120, price: 15 },
      { name: 'Taller de Teatro', stock: 120, price: 15 },
      { name: 'Taller de Lenguaje de Señas', stock: 120, price: 15 },
      { name: 'Taller de Álgebra', stock: 120, price: 15 },
      { name: 'Taller de Excel Avanzado', stock: 120, price: 15 },
      { name: 'Taller de AutoCAD', stock: 120, price: 15 },
      { name: 'Taller de Contabilidad', stock: 120, price: 15 }
    ]
  },
  {
    name: 'Cursos CEP',
    description: 'Cursos de Extensión Profesional',
    products: [
      { name: 'Curso: Mantenimiento y Reparación de PC', stock: 15, price: 25 },
      { name: 'Curso: Buenas Prácticas en Excel', stock: 15, price: 25 },
      { name: 'Curso: Diseño para no diseñadores', stock: 15, price: 25 },
      { name: 'Curso: Instalaciones Eléctricas Residenciales', stock: 15, price: 25 }
    ]
  },
  {
    name: 'Constancias',
    description: 'Constancias de diversa índole',
    products: [
      { name: 'Constancia de Culminación de Estudios', stock: -1, price: 0.9 },
      { name: 'Constancia de Servicio Comunitario', stock: -1, price: 0.9 },
      { name: 'Constancia de Horarios Firmados y Sellados', stock: -1, price: 0.9 },
      { name: 'Constancia de Estudios', stock: -1, price: 0.9 },
      { name: 'Constancia de Pasantías', stock: -1, price: 0.9 },
      { name: 'Constancia de Autenticación de Notas/Título', stock: -1, price: 0.9 },
      { name: 'Constancia de Buena Conducta', stock: -1, price: 0.9 },
      { name: 'Constancia de Notas Certificadas', stock: -1, price: 0.9 },
      { name: 'Constancia de Puesto en la Promoción', stock: -1, price: 0.9 },
      { name: 'Constancia de Horas Académicas', stock: -1, price: 0.9 },
      { name: 'Constancia de Acta de Grado', stock: -1, price: 0.9 },
      { name: 'Constancia de Modalidad de Estudio', stock: -1, price: 0.9 },
      { name: 'Constancia de Mínimo Aprobatorio', stock: -1, price: 0.9 },
      { name: 'Constancia de Tramitación de Título', stock: -1, price: 0.9 },
      { name: 'Constancia de Asistencia a Socialización TEG', stock: -1, price: 0.9 },
      { name: 'Constancia de Asistencia a Talleres ', stock: -1, price: 0.9 },
      { name: 'Constancia de Asistencia a Asesorías de TEG', stock: -1, price: 0.9 },
      { name: 'Constancia de Asistencia a Reuniones', stock: -1, price: 0.9 },
      { name: 'Constancia de Participación/Apoyo Logística de TEG', stock: -1, price: 0.9 },
      { name: 'Constancia de Asistencia a Convivencias', stock: -1, price: 0.9 },
      { name: 'Constancia de Inscripción', stock: -1, price: 0.9 }
    ]
  },
  {
    name: 'Formatos',
    description: 'Formatos predefinidos para procesos',
    products: [
      { name: 'Hoja de Graduandos', stock: -1, price: 3 },
      { name: 'Planilla de Reincorporación/Retiro de Semestre', stock: -1, price: 3 },
      { name: 'Planilla de Inscripción/Retiro de Materia', stock: -1, price: 3 }
    ]
  },
  {
    name: 'Matrícula',
    description: 'Todo lo relacionado a la matriculación',
    products: [
      { name: 'Mensualidad', stock: -1, price: 30 },
      { name: 'Recargo por retardo', stock: -1, price: 30 * 0.16 },
      { name: 'Cambio de carrera', stock: -1, price: 10 },
      { name: 'Equivalencia de carrera', stock: -1, price: 15 },
      { name: 'Reincorporación', stock: -1, price: 5 },
      { name: 'Propedéutico', stock: 300, price: 45 },
      { name: 'Derecho de Inscripción', stock: 3000, price: 30 }
    ]
  },
  {
    name: 'Grado',
    description: 'Todo lo relacionado a graduandos',
    products: [
      { name: 'Permiso de Acto de Grado', stock: 120, price: 25 },
      { name: 'Solicitud de Acto de Grado por Secretaría', stock: 120, price: 10 },
      { name: 'Paquete de constancias para graduandos', stock: 120, price: 15 },
      { name: 'Paquete de Grado', stock: 120, price: 100 },
      { name: 'Petición de grado', stock: 120, price: 12 }
    ]
  }
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

export const STUDENT_STATUS = [
  { status: MATRICULADO, description: 'Estudiante cursando carrera.' },
  { status: 'Retiro temporal', description: "Estudiante que 'congeló' la carrera." },
  { status: 'Retiro definitivo', description: 'Estudiante retirado formalmente.' },
  { status: 'Egresado', description: 'Estudiante graduado satisfactoriamente.' },
  { status: 'Inasistente', description: 'Estudiante que ha dejado de asistir al instituto.' },
  {
    status: 'Pendiente de reingreso',
    description: 'Estudiante que está en proceso de retomar los estudios.'
  }
]

export const CAREERS = [
  'Informática',
  'Contabilidad',
  'Administración',
  'Electrotecnia',
  'Electrónica',
  'Educación'
]

export const OCCUPATIONS = [
  'Técnico informático',
  'Ama de casa',
  'Oficinista',
  'Profesor',
  'Estudiante',
  'Fumigador',
  'Panadero',
  'Empresario',
  'Contador',
  'Programador',
  'Diseñador',
  'Asesor',
  'Influencer',
  'Gamer Profesional'
]

export const CURRENCIES = [
  {
    name: BOLIVAR,
    symbol: 'Bs',
    conversion: [
      { value: 11.2548, date: new Date(2022, 11, 1, 21, 0, 0, 0) },
      { value: 12.2467, date: new Date(2022, 11, 2, 21, 0, 0, 0) },
      { value: 11.539, date: new Date(2022, 11, 5, 21, 0, 0, 0) },
      { value: 11.8608, date: new Date(2022, 11, 6, 21, 0, 0, 0) },
      { value: 12.6615, date: new Date(2022, 11, 7, 21, 0, 0, 0) },
      { value: 14.1251, date: new Date(2022, 11, 9, 21, 0, 0, 0) },
      { value: 14.1251, date: new Date(2022, 11, 12, 21, 0, 0, 0) },
      { value: 14.7646, date: new Date(2022, 11, 13, 21, 0, 0, 0) },
      { value: 15.7668, date: new Date(2022, 11, 17, 21, 0, 0, 0) },
      { value: 15.7668, date: new Date(2022, 11, 18, 21, 0, 0, 0) },
      { value: 15.7668, date: new Date(2022, 11, 19, 21, 0, 0, 0) }
    ]
  },
  {
    name: 'Euro',
    symbol: '€',
    conversion: [
      { value: 0.98, date: new Date(2022, 11, 1, 8, 0, 0, 0) },
      { value: 0.94, date: new Date(2022, 11, 17, 8, 0, 0, 0) }
    ]
  },
  { name: DOLLAR, symbol: '$', conversion: [{ value: 1, date: new Date(2022, 11, 1, 8, 0, 0, 0) }] }
]

export const PAYMENT_METHODS = [
  {
    name: 'Tarjeta',
    description: 'Tarjetas de débito y/o crédito',
    currencies: [BOLIVAR]
  },
  {
    name: 'Transferencia',
    description: 'Transferencias desde bancos nacionales',
    currencies: [BOLIVAR],
    metaPayment: [{ name: 'referencia', fieldType: 'string' }]
  },
  {
    name: 'Efectivo',
    description: 'Efectivo en moneda nacional o divisas',
    currencies: [BOLIVAR, DOLLAR, 'Euro']
  },
  { name: 'Pago móvil', description: 'Pago móvil desde bancos nacionales', currencies: [BOLIVAR] }
]

export const DOCUMENT_TYPES = ['CV', 'CE', 'PP', 'RIF']

export const SECRET_QUESTIONS = [
  'Primer nombre de tu madre',
  'Segundo apellido de tu padre',
  'Nombre de tu mascota favorita',
  'Color del caballo blanco de Simón Bolivar',
  'Nombre de tu primera escuela'
]

export const SEMESTERS = [
  {
    startDate: new Date(2021, 9, 6),
    endDate: new Date(2022, 3, 1, 23, 59, 59, 999),
    semester: '2021-II'
  },
  {
    startDate: new Date(2022, 3, 2),
    endDate: new Date(2022, 9, 2, 23, 59, 59, 999),
    semester: '2022-I'
  },
  {
    startDate: new Date(2022, 9, 3),
    endDate: new Date(2023, 1, 31, 23, 59, 59, 999),
    semester: '2022-II'
  },
  {
    startDate: new Date(2023, 1, 30),
    endDate: new Date(2023, 6, 16, 23, 59, 59, 999),
    semester: '2023-I'
  }
]

export const FIRST_NAMES = [
  'Reynaldo',
  'Yhan',
  'Elisette',
  'Juan',
  'José',
  'Iraida',
  'Juanito',
  'Noris',
  'Luis',
  'Pedro',
  'Johan',
  'Eduardo',
  'Vin',
  'Kelsier',
  'Sazed',
  'Ladrian',
  'Elend',
  'Brisa',
  'Elena',
  'Elene',
  'Maria',
  'Josefina',
  'Pancracio',
  'Bob',
  'Carlos',
  'Yuleisi',
  'Elizabeth'
]
export const LAST_NAMES = [
  'González',
  'Mejías',
  'Bueno',
  'Rodriguez',
  'Montaño',
  'Venture',
  'Eldair',
  'Altozano',
  'Hernandez',
  'Terris',
  'Terrano',
  'Perez',
  'Casas',
  'Blanco',
  'Rojas',
  'Obama',
  'Swann',
  'Sparrow',
  'Bootstrap',
  'Turner'
]
export const DOMAINS = ['mail', 'gmail', 'outlook', 'yahoo', 'u-mail', 'exist', 'hotmail', 'proton']

export const DOT_MAIL = ['com', 'com.ve', 'live', 'net', 'tv', 'dev', 'link', 'tube', 'online']

export const ADDRESS = [
  'La California',
  'Catia',
  'Los Flores de Catia',
  'Mariperez',
  'Propatria',
  'Los Ruices',
  'Narnia',
  'Los Teques',
  'La Urdaneta',
  'La campiña',
  'Plaza Venezuela diagonal al SENIAT',
  'Av. Bolivar detrás de la bomba'
]
