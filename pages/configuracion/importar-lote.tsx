import { Divider, Flex, Heading, Stack, useToast } from '@chakra-ui/react'
import { FullyCenteredSpinner, SaveButton } from 'components/app'
import { SettingsLayout } from 'components/settings'
import {
  CreatedReceiptsModal,
  DocErrorList,
  ExampleSheetModal,
  FileInput,
  Preview,
  ValidFileFeedback
} from 'components/settings/batch-import'
import { HttpError } from 'lib/http-error'
import { NextPageWithLayout } from 'pages/_app'
import React, { useRef, useState } from 'react'
import { sheetSchema } from 'schema/batchImportSchema'
import { uploadChargesBatch } from 'services/batchImports'
import { ReceiptWithPerson } from 'types/receipt'
import { FormattedErrors, Sheet, SheetData } from 'types/utils'
import { encodeFile } from 'utils/encodeFile'
import { read, utils } from 'xlsx'

const BatchImport: NextPageWithLayout = () => {
  const [errors, setErrors] = useState<{ formatted: FormattedErrors; flattened: string[] }>()
  const [fileName, setFileName] = useState<string>()
  const [sheet, setSheet] = useState<Sheet>()
  const [validSheet, setValidSheet] = useState<SheetData>()
  const [createdReceipts, setCreatedReceipts] = useState<ReceiptWithPerson[]>()
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const encodedFile = useRef<string>()
  const toast = useToast()

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

    setIsValidating(true)
    const validation = await sheetSchema.safeParseAsync(sheet)
    setIsValidating(false)
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

    setValidSheet(validation.data)
    setErrors(undefined)
  }

  const reset = () => {
    setErrors(undefined)
    setFileName(undefined)
    setSheet(undefined)
    setValidSheet(undefined)
    encodedFile.current = undefined
  }

  const handleSubmit = async () => {
    if (!validSheet) return
    setIsSubmitting(true)
    try {
      const receipts = await uploadChargesBatch(validSheet)
      setCreatedReceipts(receipts)
      reset()
    } catch (error) {
      if (error instanceof HttpError) {
        toast({
          status: 'error',
          description: 'Ocurrió un error al procesar el documento: ' + error.message,
          duration: null,
          isClosable: true
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Stack gap={3}>
      <Flex alignItems="center" justify="space-between">
        <Heading size="lg">Importar lote de cobros</Heading>
        <ExampleSheetModal />
      </Flex>

      <FileInput fileName={fileName} onChange={handleChange} onClick={reset} />

      {fileName && <Divider />}

      {errors && <DocErrorList errors={errors.flattened} />}

      {validSheet && (
        <>
          <ValidFileFeedback />
          <SaveButton onClick={handleSubmit} isLoading={isSubmitting}>
            Subir lote de cobros
          </SaveButton>
        </>
      )}

      {isValidating && <FullyCenteredSpinner />}

      {sheet && <Preview sheet={sheet} errors={errors?.formatted} />}

      <CreatedReceiptsModal
        isOpen={!!createdReceipts}
        receipts={createdReceipts}
        onClose={() => setCreatedReceipts(undefined)}
      />
    </Stack>
  )
}

BatchImport.getLayout = (page) => (
  <SettingsLayout title="Importar lote de cobros">{page}</SettingsLayout>
)

export default BatchImport
