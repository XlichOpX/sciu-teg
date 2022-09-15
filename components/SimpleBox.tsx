import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

function SimpleBox({ children }: { children: ReactNode }) {
  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
      {children}
    </Box>
  )
}

export default SimpleBox
