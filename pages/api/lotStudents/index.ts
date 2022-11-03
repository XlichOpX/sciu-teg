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
    try {
      // obtenemos los datos en un formate manejable.
      const { dataCell } = handleBody(req.body)
      const charges = parseData(dataCell)

      // Preparamos las queries a realizar
      res.json({ response: dataCell, sortCharges: charges })
    } catch (error) {
      console.error(error)
      res.send(JSON.stringify({ error: error }, null, 2))
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

/**
 * Enpoint temporal para la creación de la lógica de cargar un excel con muchos cobros.
 *
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
/**
 * manejo del cuerpo de la request para convertir el archivo en un objeto manejable
 * con XLSX
 */
const handleBody = (body: NextApiRequest['body']) => {
  //Leemos el cuerpo y formateamos a un workBook, básicamente a un objeto manejable en js
  const workBook = XLSX.read(body, {
    type: 'base64',
    cellDates: true,
    cellFormula: true,
    dense: true
  })
  const sheetName = workBook.SheetNames[0]
  const workSheet = workBook.Sheets[sheetName]['!data']

  const rows = workSheet?.map((row, index, arr) => {
    const r = index
    return row
      .map((col, index) => {
        const c = index
        const cell = col.v || col.w
        const addr = XLSX.utils.encode_cell({ r, c })
        const prop = XLSX.utils.format_cell(arr[0][c])
        return { [prop]: cell, [`${prop}_addr`]: addr }
      })
      .reduce((row, cell) => {
        return { ...row, ...cell }
      }, {})
  })

  // eliminamos el registro 0 (cabecera)
  rows?.shift()
  //Devolvemos el workbook inicial y el dataCell formateado.
  return { workBook, dataCell: rows }
}

const parseData = (
  dataCell: { [x: string]: string | number | Date | boolean | undefined }[] | undefined
) => {
  if (!dataCell) throw Error(`not dataCell`)
  const rows = dataCell.map((row) => {
    const person = row['cedula']
    if (!person) throw new Error(`not found data in ${row['cedula_addr']}`)
    const productPrice = row['precio']
    if (!productPrice) throw new Error(`not found data in ${row['precio_addr']}`)
    const quantity = row['cantidad']
    if (!quantity) throw new Error(`not found data in ${row['cantidad_addr']}`)
    const paymentMethod = row['metodo_de_pago']
    if (!paymentMethod) throw new Error(`not found data in ${row['metodo_de_pago_addr']}`)
    const amount = row['monto_cobrado']
    if (!amount) throw new Error(`not found data in ${row['monto_cobrado_addr']}`)
    const paymentMethodRef = row['referencia']
    if (!paymentMethodRef) throw new Error(`not found data in ${row['referencia_addr']}`)
    const paymentMethodDate = new Date(row['fecha'])
    if (!paymentMethodDate) throw new Error(`not found data in ${row['fecha_addr']}`)
    const conversion = row['conversion']
    if (!conversion) throw new Error(`not found data in ${row['conversion_addr']}`)
    const productName =
      row['producto'] == 'mensualidad'
        ? `${row['mensualidad']} ${row['semestre']}`
        : row['producto']
    if (!productName)
      throw new Error(
        `not fount data in ${
          row['producto'] === 'mensualidad'
            ? `${row['mensualidad_addr']} ó ${row['semestre_addr']}`
            : row['product_addr']
        }`
      )
    return {
      person,
      productPrice,
      quantity,
      paymentMethod,
      amount,
      paymentMethodRef,
      paymentMethodDate,
      conversion,
      productName
    }
  })
  return rows
}
/**
body: {
  amount: number      === SUMA(productos|billing.amount) 
  billings: number    Where billing.productName === producto
  charges: {
    amount: number    === monto_cobrado/SUMA(productos|billing.amount)
    paymentMethod: {  where paymentMethod.name === metodo_de_pago
      id: number
      metaPayment:{
        name:         string          ===   referencia  &&  fecha
        value:        string          ===   ref_de_pago &&  fecha_de_pago
        fieldType:    string | date   ===   string      &&  date
      }
      conversion: number  where monto_cobrado/SUMA(productos|billing.amount) === conversion
    }
  }
  products: {
    id: number      Where product.name  === producto
    quantity: number                    === cantidad
  }
  person: number    Where DocNum        === cedula_estudiante
}
 **/
