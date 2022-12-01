import {
  chakra,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal
} from '@chakra-ui/react'
import { useLatestConversions } from 'hooks'
import { RefObject } from 'react'
import { round } from 'utils/round'

export const ConvertableAmount = ({
  amount,
  portalRef
}: {
  amount: number
  portalRef?: RefObject<HTMLElement>
}) => {
  const { latestConversions } = useLatestConversions()

  return (
    <Popover trigger="hover" variant="dark" isLazy>
      <PopoverTrigger>
        <chakra.span borderBottom="1px dashed currentColor" pb="1px" tabIndex={0}>
          ${round(amount).toLocaleString()}
        </chakra.span>
      </PopoverTrigger>

      <Portal containerRef={portalRef}>
        <PopoverContent width="auto">
          <PopoverBody>
            {latestConversions
              ? latestConversions.map((lc) =>
                  lc.currency.name !== 'Dólar' ? (
                    <p key={lc.id}>
                      {lc.currency.symbol} {round(amount * lc.value).toLocaleString()}
                    </p>
                  ) : null
                )
              : 'Cargando...'}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
