import { chakra, Divider, Heading } from '@chakra-ui/react'
import { FullyCenteredSpinner, SimpleBox } from 'components/app'
import { useLatestConversions } from 'hooks'
import { ComponentProps } from 'react'

export const LatestConversions = (props: ComponentProps<typeof SimpleBox>) => {
  const { latestConversions, isLoading } = useLatestConversions()
  return (
    <SimpleBox shadow="md" p={4} {...props}>
      {latestConversions && (
        <>
          <Heading size="sm">Tasas de cambio</Heading>
          <Divider my={2} />
          <chakra.ul listStyleType="none">
            {latestConversions.map((lc) => (
              <li key={lc.id}>
                <chakra.span fontWeight="medium">{lc.currency.name}:</chakra.span>{' '}
                {lc.currency.symbol} {lc.value} = $1
              </li>
            ))}
          </chakra.ul>
        </>
      )}
      {isLoading && <FullyCenteredSpinner />}
    </SimpleBox>
  )
}
