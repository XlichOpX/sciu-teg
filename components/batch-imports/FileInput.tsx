import { Button, chakra, Flex, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { BsPlusLg } from 'react-icons/bs'

export const FileInput = ({
  fileName,
  onChange,
  onClick
}: {
  fileName?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onClick: React.MouseEventHandler<HTMLInputElement>
}) => {
  return (
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
        onChange={onChange}
        onClick={(e) => {
          ;(e.target as HTMLInputElement).value = ''
          onClick(e)
        }}
        display="none"
      />
    </FormLabel>
  )
}
