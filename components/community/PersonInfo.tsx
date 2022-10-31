import { Divider, Flex, Text } from '@chakra-ui/react'
import { ViewReceiptsModal } from 'components/charges'
import { PersonWithAll } from 'types/person'

export const PersonInfo = ({ person }: { person: PersonWithAll }) => {
  const fullName = person.firstName + ' ' + person.firstLastName
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>
          {fullName} / {person.docType.type}-{person.docNumber}
        </Text>
        <ViewReceiptsModal fullName={fullName} personDocNum={person.docNumber} />
      </Flex>
      <Divider my={4} />
    </>
  )
}
