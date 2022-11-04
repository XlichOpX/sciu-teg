import { Divider, Flex, Text } from '@chakra-ui/react'
import { ViewReceiptsModal } from 'components/charges'
import { ClientWithPersonAndOccupation } from 'types/client'

export const ClientInfo = ({ client }: { client: ClientWithPersonAndOccupation }) => {
  const fullName = client.person.firstName + ' ' + client.person.firstLastName
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>
          {fullName} / {client.person.docNumber}
        </Text>
        <ViewReceiptsModal fullName={fullName} personDocNum={client.person.docNumber} />
      </Flex>
      <Divider my={4} />
    </>
  )
}
