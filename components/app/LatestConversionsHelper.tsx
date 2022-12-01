import {
  Alert,
  Button,
  ButtonProps,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
  VisuallyHidden
} from '@chakra-ui/react'
import { useLatestConversions } from 'hooks'
import { FaExchangeAlt } from 'react-icons/fa'
import { FullyCenteredSpinner } from './FullyCenteredSpinner'

export const LatestConversionsHelper = ({
  buttonProps,
  popoverContentProps
}: {
  buttonProps: ButtonProps
  popoverContentProps: PopoverContentProps
}) => {
  const { latestConversions, isLoading, error } = useLatestConversions()
  const bsConversion = latestConversions?.find((lc) => lc.currency.name === 'Bolívar')

  return (
    <Popover variant="dark" trigger="hover">
      <PopoverTrigger>
        <Button rounded="full" variant="outline" colorScheme="blue" {...buttonProps}>
          <VisuallyHidden>Tasas de cambio</VisuallyHidden>
          <Icon as={FaExchangeAlt} />
        </Button>
      </PopoverTrigger>

      <PopoverContent w="auto" {...popoverContentProps}>
        <PopoverBody>
          {isLoading && <FullyCenteredSpinner />}

          {bsConversion &&
            latestConversions?.map((conversion) =>
              conversion.currency.name !== bsConversion.currency.name ? (
                <p key={conversion.id}>
                  {conversion.currency.symbol} 1 = {bsConversion.currency.symbol}{' '}
                  {(bsConversion.value / conversion.value).toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </p>
              ) : null
            )}

          {!isLoading && error && <Alert status="error">{error.message}</Alert>}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
