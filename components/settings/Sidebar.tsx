import { Button, Divider, Flex } from '@chakra-ui/react'
import Link from 'next/link'

const links = [
  {
    href: 'general',
    text: 'General'
  },
  {
    href: 'usuarios',
    text: 'Usuarios'
  },
  {
    href: 'roles',
    text: 'Roles'
  },
  {
    href: 'metodos-de-pago',
    text: 'Métodos de pago'
  },
  {
    href: 'tasas-de-cambio',
    text: 'Tasas de cambio'
  }
]

function Sidebar() {
  return (
    <>
      <Flex as="ul" direction="column" gap={4} listStyleType="none">
        {links.map((li) => (
          <li key={li.href}>
            <Link href={li.href} passHref>
              <Button as="a" width="full" justifyContent="flex-start">
                {li.text}
              </Button>
            </Link>
          </li>
        ))}
      </Flex>
      <Divider mt={4} display={['block', 'none']} />
    </>
  )
}

export default Sidebar
