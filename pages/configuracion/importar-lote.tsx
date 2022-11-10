import {
  Button,
  chakra,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr
} from '@chakra-ui/react'
import { SaveButton } from 'components/app'
import { SettingsLayout } from 'components/settings'
import dayjs from 'dayjs'
import { NextPageWithLayout } from 'pages/_app'
import React, { useState } from 'react'
import { BsCheckCircleFill, BsPlusLg, BsXCircleFill } from 'react-icons/bs'
import { encodeFile } from 'utils/encodeFile'
import { read, utils } from 'xlsx'
import { z } from 'zod'

/** Intenta convertir el input a string antes de validarlo como tal */
const castToString = z.preprocess(
  (arg) => (typeof arg !== 'undefined' ? String(arg) : arg),
  z.string()
)

/** Schema de validación para cada fila del Excel */
const sheetSchema = z
  .object({
    cedula: castToString,
    semestre: castToString.optional(),
    mensualidad: z.string().optional(),
    producto: z.string(),
    precio: z.number().positive(),
    cantidad: z.number().positive().int(),
    metodo_de_pago: z.string(),
    monto_cobrado: z.number().positive(),
    referencia: castToString,
    fecha: z.date()
  })
  .array()

const BatchImport: NextPageWithLayout = () => {
  const [errors, setErrors] = useState<string[] | undefined>()
  const [fileName, setFileName] = useState<string>()
  const [sheet, setSheet] = useState<unknown[][]>()
  console.log(sheet)
  const isValid = !errors && fileName

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const encodedFile = await encodeFile(file)
    const workbook = read(encodedFile, { type: 'base64', cellDates: true })

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    setSheet(utils.sheet_to_json(firstSheet, { header: 1, defval: '', blankrows: false }))

    const sheetJson = utils.sheet_to_json(firstSheet)

    const validationResult = sheetSchema.safeParse(sheetJson)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((i) => {
        // Teniendo en cuenta que dada la forma del schema i.path = [index, colName]
        // Obtenemos el num de fila sumando 2, tomando así en cuenta el offset generado
        // porque el array comienza con la posición 0 y la primera fila de encabezados
        const row = (i.path[0] as number) + 2
        const col = i.path[1]
        return `Dato inválido en la fila '${row}' en la columna '${col}': ${i.message}`
      })
      setErrors(errors)
      return
    }

    setErrors(undefined)
    const data = validationResult.data
    console.log({ data })
  }

  return (
    <Stack gap={3}>
      <Heading size="lg">Importar lote de cobros</Heading>

      <FormLabel _hover={{ cursor: 'pointer' }}>
        <chakra.div mb={3}>Archivo de Excel</chakra.div>

        <Flex gap={3} alignItems="center">
          <Button as="span" leftIcon={<BsPlusLg />} variant="outline">
            Seleccionar archivo
          </Button>
          <p>{fileName}</p>
        </Flex>

        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          onClick={(e) => {
            ;(e.target as HTMLInputElement).value = ''
            setErrors(undefined)
            setFileName(undefined)
            setSheet(undefined)
          }}
          display="none"
        />
      </FormLabel>

      {fileName && <Divider />}

      {errors && (
        <Stack as="ul" listStyleType="none">
          {errors.map((e, i) => (
            <chakra.li key={i} _dark={{ color: 'red.300' }} _light={{ color: 'red.400' }}>
              <Flex alignItems="center" gap={2}>
                <BsXCircleFill />
                <p>{e}</p>
              </Flex>
            </chakra.li>
          ))}
        </Stack>
      )}

      {isValid && (
        <>
          <Flex
            gap={2}
            alignItems="center"
            _dark={{ color: 'green.300' }}
            _light={{ color: 'green' }}
          >
            <p>El documento cumple con el formato predefinido</p>
            <BsCheckCircleFill />
          </Flex>
          <SaveButton>Subir lote de cobros</SaveButton>
        </>
      )}

      {sheet && (
        <>
          <Heading size="lg">Previsualización</Heading>
          <TableContainer>
            <Table>
              <Tbody>
                {sheet.map((row, i) => (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    {row.map((cell, j) => {
                      let content: string | number | null
                      if (typeof cell === 'string' || typeof cell === 'number') {
                        content = cell
                      } else if (typeof cell === 'object' && cell instanceof Date) {
                        content = dayjs(cell).format('DD/MM/YYYY')
                      } else {
                        content = 'Desconocido'
                      }
                      return (
                        <Td key={j} wordBreak="break-word">
                          {content}
                        </Td>
                      )
                    })}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </Stack>
  )
}

BatchImport.getLayout = (page) => (
  <SettingsLayout title="Importar lote de cobros">{page}</SettingsLayout>
)

export default BatchImport
