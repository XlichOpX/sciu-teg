export {}

/**
 import { Prisma } from '@prisma/client'
 const tables = Prisma.dmmf.datamodel.models
 * Para crear reportes en este sistema:
 * 0.) ¿Lo haremos dinámico?
 *
 * 1.) Crear tabla donde almacenar la estructura de estos.
 *
 * 2.) Definir la estructura y evidentemente los datos que almacenará la tabla relacionada
 *
 * 3.) Recuperar la estructura almacenada en la tabla, iterarla para preparar la/las queries necesarias
 * generando así las consultas necesarias a la base de datos y entregando información lógica bajo
 * los parámetros asignados.
 *
 * 4.) Establecer una interface (endpoint para backend) simple que reciba la configuración y cree estas estructuras de
 * reportes
 * Esta interface debe establecer previamente relaciones para limitar y evitar búsquedas sin sentido.
 * (Ej. ❌ Personas -> Conversiones
 * 			✅ Personas -> Recibos -> Conversiones
 * )
 *
 * 5.) Así mismo establecer una interface (endpoint para backend) que consuma la estructura y muestre el resultado
 * esperado. Esta a su vez, tendrá también algunos datos o campos que se puedan utilizar para filtrar la información
 * entregada (en el frontEnd)
 * 6.) Dar la capacidad de imprimir
 *
 * Idea de la estructura a manejar como 'reportSchema'
 * ReportSchema {
 * 	reportName: string					(Nombre del reporte dado por el usuario),
 * 	dataModels: {								(Arreglo de objetos que modelará cada tabla a utilizar)
 * 		table: string, 						(nombre de la tabla)
 * 		fields: {									(nombre de los campos a extraer de la tabla)
 * 			name: string,						(nombre del campo)
 * 			type: string,						(tipo del campo según Schema de prisma)
 * 			isId: boolean,					( si es el id o no)
 * 			kind: FieldKind					(si es un scalar, una referencia (object) u otra cosa)
 * 		}[],
 * 		isPrimary: boolean				(indicará si es la tabla principal)(default false)
 * 	}[],
 * 	orderBy: { 									(Objecto que dicta que campo y que orden usar por defecto en la query)
 * 		field: string,
 * 		sorter: 'asc' | 'desc' 		(default 'desc')
 * 	}
 * }
 *
 * ModelParser {								(Objeto que contendrá los nombres 'referenciales' para la gente de las entidades. Podría ser una tabla)
 * 	[modelName:string]: string
 * }
 *
 * Podríamos crear una tabla donde se almacenen todas las relaciones para ser consumidas de forma 'simple' por el sistema
 * (aunque no habría forma de actualizarla automáticamente, mejor utilizar lógica para esto...)
 * Model = Tabla
 * Field = Campo de la tabla
 * Type = Tipo de dado según schema de Prisma
 * Kind = Si un dato normal, una relación o algo distinto
 */
