import { Box, BoxProps } from '@chakra-ui/react'

function SimpleBox({ children, ...props }: BoxProps) {
  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} {...props}>
      {children}
    </Box>
  )
}

export default SimpleBox
