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
import { ExampleSheetModal } from 'components/settings/charges-batch-import'
import { HttpError } from 'lib/http-error'
import { NextPageWithLayout } from 'pages/_app'
import React, { useRef, useState } from 'react'
import { BsCheckCircleFill, BsPlusLg, BsXCircleFill } from 'react-icons/bs'
import { sheetSchema } from 'schema/batchImportSchema'
import { uploadChargesBatch } from 'services/batchImports'
import { encodeFile } from 'utils/encodeFile'
import { parseCellContent } from 'utils/parseCellContent'
import { read, utils } from 'xlsx'
import { z } from 'zod'

type FormattedErrors = z.inferFormattedError<typeof sheetSchema>

const BatchImport: NextPageWithLayout = () => {
  const [errors, setErrors] = useState<{ formatted: FormattedErrors; flattened: string[] }>()
  const [fileName, setFileName] = useState<string>()
  const [sheet, setSheet] = useState<{ headings: unknown[]; data: unknown[][] }>()
  const encodedFile = useRef<string>()
  const isFileValid = !errors && fileName

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return

    encodedFile.current = await encodeFile(file)
    const workbook = read(encodedFile.current, { type: 'base64', cellDates: true })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

    /** Array of arrays */
    const aoa = utils.sheet_to_json<unknown[]>(firstSheet, {
      header: 1,
      blankrows: false,
      defval: null
    })
    const headings = aoa[0]
    const data = aoa.slice(1)
    const sheet = { headings, data }

    setFileName(file.name)
    setSheet(sheet)

    const validation = sheetSchema.safeParse(sheet)
    if (!validation.success) {
      const formattedErrors = validation.error.format()
      const flatErrors = validation.error.flatten((issue) => {
        if (issue.path.length === 2) {
          // En este caso path sería ['headings', col: number]
          const cell = utils.encode_cell({ r: 0, c: +issue.path[1] })
          return `Encabezado inválido en la celda ${cell}. ${issue.message}`
        } else if (issue.path.length === 3) {
          // En este caso path sería ['headings', row: number, col: number]
          // aún así le sumamos 1 a row para tener en cuenta la fila de encabezados
          const cell = utils.encode_cell({ r: +issue.path[1] + 1, c: +issue.path[2] })
          return `Valor inválido en la celda ${cell}. ${issue.message}`
        } else {
          return 'Error desconocido'
        }
      }).fieldErrors

      const dataErrors = flatErrors.data ?? []
      const headingsErrors = flatErrors.headings ?? []
      const allErrors = [...headingsErrors, ...dataErrors]

      setErrors({ formatted: formattedErrors, flattened: allErrors })
      return
    }

    setErrors(undefined)
  }

  const handleSubmit = async () => {
    if (!encodedFile.current) return
    try {
      const receipts = await uploadChargesBatch(encodedFile.current)
      alert(JSON.stringify(receipts))
    } catch (error) {
      if (error instanceof HttpError) {
        alert(error.message)
      }
    }
  }

  return (
    <Stack gap={3}>
      <Flex alignItems="center" justify="space-between">
        <Heading size="lg">Importar lote de cobros</Heading>
        <ExampleSheetModal />
      </Flex>

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
            encodedFile.current = undefined
          }}
          display="none"
        />
      </FormLabel>

      {fileName && <Divider />}

      {errors && (
        <Stack as="ul" listStyleType="none">
          {errors.flattened.map((e, i) => (
            <chakra.li key={i} _dark={{ color: 'red.300' }} _light={{ color: 'red.400' }}>
              <Flex alignItems="center" gap={2}>
                <BsXCircleFill />
                <p>{e}</p>
              </Flex>
            </chakra.li>
          ))}
        </Stack>
      )}

      {isFileValid && (
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
          <SaveButton onClick={handleSubmit}>Subir lote de cobros</SaveButton>
        </>
      )}

      {sheet && (
        <>
          <Heading size="lg">Previsualización</Heading>
          <TableContainer>
            <Table>
              <Tbody>
                <Tr>
                  <Td></Td>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Td key={i} textAlign="center">
                      {utils.encode_col(i)}
                    </Td>
                  ))}
                </Tr>
                <Tr>
                  <Td>1</Td>
                  {sheet.headings.map((h, i) => (
                    <Td key={i} bgColor={errors?.formatted.headings?.[i] ? 'red.200' : undefined}>
                      {parseCellContent(h)}
                    </Td>
                  ))}
                </Tr>
                {sheet.data.map((row, i) => (
                  <Tr key={i}>
                    <Td>{i + 2}</Td>
                    {row.map((cell, j) => (
                      <Td
                        key={j}
                        bgColor={errors?.formatted.data?.[i]?.[j] ? 'red.200' : undefined}
                      >
                        {parseCellContent(cell)}
                      </Td>
                    ))}
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
