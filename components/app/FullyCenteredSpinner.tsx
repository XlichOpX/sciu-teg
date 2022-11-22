import { Flex, Spinner } from '@chakra-ui/react'

export const FullyCenteredSpinner = () => (
  <Flex alignItems="center" justifyContent="center" width="full">
    <Spinner />
  </Flex>
)
