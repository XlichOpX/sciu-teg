import { FormControl, FormLabel, Switch, useColorMode } from '@chakra-ui/react'

export const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <FormControl display="flex" alignItems="center" gap={3}>
      <FormLabel m={0} fontWeight="bold" fontSize="xl">
        Usar tema oscuro:
      </FormLabel>
      <Switch size="lg" onChange={toggleColorMode} isChecked={colorMode === 'dark'} />
    </FormControl>
  )
}
