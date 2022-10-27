import { Button, Divider, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
  {
    href: '/configuracion/general',
    text: 'General'
  },
  {
    href: '/configuracion/usuarios',
    text: 'Usuarios'
  },
  {
    href: '/configuracion/roles',
    text: 'Roles'
  },
  {
    href: '/configuracion/metodos-de-pago',
    text: 'Métodos de pago'
  },
  {
    href: '/configuracion/tasas-de-cambio',
    text: 'Tasas de cambio'
  },
  {
    href: '/configuracion/categorias',
    text: 'Categorías'
  }
]

links.sort((a, b) => {
  if (a.text > b.text) return 1
  if (a.text < b.text) return -1
  return 0
})

export const SettingsSidebar = () => {
  const { asPath } = useRouter()
  return (
    <>
      <Flex as="ul" direction="column" gap={4} listStyleType="none">
        {links.map((li) => (
          <li key={li.href}>
            <Link href={li.href} passHref>
              <Button
                as="a"
                w="full"
                variant={asPath === li.href ? 'solid' : 'ghost'}
                justifyContent="flex-start"
                pointerEvents={asPath === li.href ? 'none' : undefined}
              >
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
