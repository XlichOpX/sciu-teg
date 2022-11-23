import { Flex, FlexProps, Spinner } from '@chakra-ui/react'

export const FullyCenteredSpinner = (props: FlexProps) => (
  <Flex alignItems="center" justifyContent="center" width="full" {...props}>
    <Spinner />
  </Flex>
)
