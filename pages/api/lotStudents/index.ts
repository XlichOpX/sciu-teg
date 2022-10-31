import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import type { NextApiRequest, NextApiResponse } from 'next'
import XLSX from 'xlsx'

// Disable `bodyParser` to consume as stream
// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log(req.body)
    try {
      const workBook = XLSX.read(req.body, { type: 'base64' })
      const sheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(workSheet)
      res.send({ response: data })
    } catch (error) {
      console.error(error)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

/**
 * Enpoint temporal para la creación de la lógica de cargar un excel con muchos cobros.
 *
 * Para lograr esto requerimos dos partes de lógica.
 * En el front, surtir una interface con un uploader de archivos EXCEL
 * (SOLO 'Hojas de Cálculo' o CSV, aún por definir las extensiones a admitir, falta buscar una lib que lo haga)
 * en el back, se recibirá un POST con el archivo suministrado y se parseará a javascript Object.
 *
 * Se extrae la data de este y se iterará por 'ROW' ? (Filas)
 *
 * Cada fila será un producto. A no ser que se vea una forma de generar args ilimitados por columnas
 * (a partir de una en particular)
 *
 * Al iterar, se debe almacenar una referencia al campo que se está leyendo en todo momento, en caso de error devolver
 * un mensaje amigable con esta referencia para su correción Incluso poder facilitar observaciones de posibles errores.
 *
 * Se validará que la data sea consistente y no se haya cobrado anteriormente
 * (al menos que el último cobro no haya sido demasiado similar persona/monto/fecha/metpago/algún otro valor que determinemos clave)
 *
 * Antes/durante/después de la validación, se organizarán los cobros para realizar el mínimo número de recibos por estudiantes
 * generando así un recibo por estudiante/persona en el archivo de ser posible
 *
 * Por cada recibo que se genere se ha de mandar a 'imprimir' dicho recibo y entregarlo en PDF
 * o bien enviarlo directamente a un correo que estará indicado en el archivo cargado / registrado en el sistema
 *
 * Buscar la manera (de ser posible) de mostar el progreso en el frontend. Caso contrario dar un loading y entregar
 * respuesta de éxito o error.
 *
 * En caso de error NADA debería de hacerse. (todo el proceso debería de invertirse y no tocar nada.)
 *
 */
