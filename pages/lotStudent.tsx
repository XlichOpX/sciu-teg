import { fetch } from 'lib/fetch'
import Head from 'next/head'
import { ChangeEvent, FormEvent, useState } from 'react'
import { DataMatriz } from 'types/utils'
import { parse } from 'utils/convertToJSON'
import XLSX from 'xlsx'
import { NextPageWithLayout } from './_app'

const LotStudent: NextPageWithLayout = () => {
  const [datable, setDatable] = useState([{}])

  const readFile = (event: ChangeEvent) => {
    try {
      const { target } = event as unknown as { target: EventTarget & { files: File[] } }
      if (!target.files) throw Error('File not found')
      const file = target.files[0]
      const reader = new FileReader()

      reader.onload = ({ target }) => {
        if (!target) throw Error('not Target defined')
        const { result } = target
        if (!result) throw Error('not Result defined')
        const workBook = XLSX.read(result, { type: 'binary' })

        const workSheetName = workBook.SheetNames[0]
        const workSheet = workBook.Sheets[workSheetName]

        const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 }) as DataMatriz

        // extraemos la primera fila para obtener las cabeceras y mapeamos a un objeto
        const headers = fileData[0]
        fileData.splice(0, 1)
        parse(headers, fileData).then((rows) => setDatable(rows))
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      console.error({ error })
    }
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const result = await fetch('/api/lotStudents', { method: 'POST', body: datable })
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <Head>
        <title>Carga de Excel</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <label htmlFor="excel">Ingresa un archivo excel</label>
        <br />
        <input type="file" onChange={readFile} />
        {/**Cargamos acá un pre por ahora, luego usaremos una LIB para ejecutar una tabla de excel editable :D */}
        <pre>{JSON.stringify(datable, null, 2)}</pre>
        {/** Este submit es simplemente para ver que, después de subir el archivo y que esté en el pre wapo entonces sea enviado al back */}
        <input type="submit" value=" Cargar hoja de cáculo " />
      </form>
    </>
  )
}

export default LotStudent
