import { Box, BoxProps } from '@chakra-ui/react'

export const SimpleBox = ({ children, ...props }: BoxProps) => (
  <Box borderWidth="1px" borderRadius="md" p={4} {...props}>
    {children}
  </Box>
)
