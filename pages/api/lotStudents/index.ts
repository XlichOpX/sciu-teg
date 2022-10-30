import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import type { NextApiRequest, NextApiResponse } from 'next'

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
    // try {
    //   // Promisified `form.parse`
    //   // const jsonData = await new Promise(function (resolve, reject) {
    //   //   const form = formidable({ uploadDir: './', keepExtensions: true })
    //   //   form.parse(req, async (err, fields, files) => {
    //   //     console.log('fields:', fields)
    //   //     console.log('files:', files)
    //   //     if (err) {
    //   //       reject(err)
    //   //       return
    //   //     }

    //   //     try {
    //   //       if (!Array.isArray(files.file)) {
    //   //         const workbook = XLSX.readFile(files.file.filepath)
    //   //         const sheet = workbook.Sheets[workbook.SheetNames[0]]
    //   //         const jsonSheet = XLSX.utils.sheet_to_json(sheet)
    //   //         resolve(jsonSheet)
    //   //       } else throw new Error('not send more that one file')
    //   //     } catch (err) {
    //   //       reject(err)
    //   //     }
    //   //   })
    //   // })

    //   return res.status(200).json({})
    // } catch (err) {
    //   console.error('Error while parsing the form', err)
    //   return res.status(500).json({ error: err })
    // }
    res.send({ type: typeof req.body, response: req.body })
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
