import { Flex, Button, VisuallyHidden, Text } from '@chakra-ui/react'

function Pagination({
  page = 1,
  pages = 20,
  setPage = () => null
}: {
  page?: number
  setPage?: (page: number) => void
  pages?: number
}) {
  const totalButtons = pages >= 3 ? 3 : pages
  const inFirstPages = page < totalButtons
  const inLastPages = page > pages - totalButtons

  let buttons = Array.from<{ number: number; active: boolean }>({ length: totalButtons })

  if (inFirstPages) {
    buttons = buttons.map((_, i) => ({
      number: i + 1,
      active: i + 1 === page
    }))
  } else if (inLastPages) {
    buttons = buttons.map((_, i) => {
      const number = pages - totalButtons + i + 1
      return { number, active: number === page }
    })
  } else {
    buttons = buttons.map((_, i) => {
      const number = page - Math.floor(totalButtons / 2) + i
      return {
        number,
        active: page === number
      }
    })
  }

  return (
    <>
      <Flex my={4} gap={2} justifyContent="center">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <VisuallyHidden>Página anterior</VisuallyHidden>←
        </Button>
        {buttons.map((b, i) => (
          <Button
            key={i}
            colorScheme={b.active ? 'blue' : undefined}
            onClick={() => setPage(b.number)}
          >
            {b.number}
          </Button>
        ))}
        <Button onClick={() => setPage(page + 1)} disabled={page === pages}>
          <VisuallyHidden>Página siguiente</VisuallyHidden>→
        </Button>
      </Flex>
      <Text textAlign="center">
        Página {page} de {pages}
      </Text>
    </>
  )
}

export default Pagination
