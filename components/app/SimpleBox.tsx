import { Box, BoxProps } from '@chakra-ui/react'

function SimpleBox({ children, ...props }: BoxProps) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4} {...props}>
      {children}
    </Box>
  )
}

export default SimpleBox
