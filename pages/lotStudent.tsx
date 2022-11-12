import { fetch } from 'lib/fetch'
import Head from 'next/head'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import XLSX from 'xlsx'
import { NextPageWithLayout } from './_app'

const LotStudent: NextPageWithLayout = () => {
  const [datable, setDatable] = useState('')
  const [preparedFile, setPreparedFile] = useState('')
  const readFile = (event: ChangeEvent) => {
    try {
      const { target } = event as unknown as { target: EventTarget & { files: File[] } }
      if (!target.files) throw Error('File not found')
      const file = target.files[0]
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        if (typeof reader.result !== 'string') throw Error('not Result defined')
        const encodedFile = reader.result.replace(/data:.*\/.*;base64,/, '')
        setPreparedFile(encodedFile)
      })
      reader.readAsDataURL(file)
    } catch (error) {
      console.error({ error })
    }
  }
  useEffect(() => {
    if (!preparedFile) return
    const workBook = XLSX.read(preparedFile, { type: 'base64' })
    const sheetName = workBook.SheetNames[0]
    const workSheet = workBook.Sheets[sheetName]
    const htmlformat = XLSX.utils.sheet_to_html(workSheet).match(/(<table>.*<\/table>)/)
    if (!htmlformat) return
    setDatable(htmlformat[0])
  }, [preparedFile])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const result = await fetch('/api/lotStudents', { method: 'POST', body: preparedFile })
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
        <br />
        {/**Cargamos acá un pre por ahora, luego usaremos una LIB para ejecutar una tabla de excel editable :D */}
        {/** Este submit es simplemente para ver que, después de subir el archivo y que esté en el pre wapo entonces sea enviado al back */}
        {datable ? <div dangerouslySetInnerHTML={{ __html: datable }}></div> : ''}
        <br />
        <input type="submit" value=" Cargar hoja de cáculo " />
      </form>
    </>
  )
}

export default LotStudent
