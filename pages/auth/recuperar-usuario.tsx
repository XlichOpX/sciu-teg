import { Divider, Flex, Heading, Link } from '@chakra-ui/react'
import { NewPasswordForm, SearchUserForm, SecretsForm } from 'components/auth/password-recovery'
import { useAuth } from 'hooks'
import Head from 'next/head'
import NLink from 'next/link'
import { useState } from 'react'
import { GetUserSecretResponse } from 'services/auth'
import { NextPageWithLayout } from '../_app'

const UserRecovery: NextPageWithLayout = () => {
  const [userRecovery, setUserRecovery] = useState<GetUserSecretResponse>()
  const [canChangePassword, setCanChangePassword] = useState(false)
  const { logout } = useAuth()

  return (
    <>
      <Head>
        <title>Recuperar usuario - SCIU</title>
      </Head>

      <Flex
        justifyContent="center"
        alignItems="center"
        mx="auto"
        w={['full', 'md']}
        minH="100vh"
        p={4}
        direction="column"
        gap={6}
      >
        <NLink href="/auth/login" passHref>
          <Link alignSelf="flex-start" onClick={logout}>
            ← Volver al inicio de sesión
          </Link>
        </NLink>
        <Divider />

        <Heading as="h1" textAlign="center" w="full" mb={4}>
          SCIU
          <br />
          Recuperar acceso
        </Heading>
        <Divider />

        {!canChangePassword && <SearchUserForm afterSubmit={(data) => setUserRecovery(data)} />}

        {userRecovery && !canChangePassword && (
          <SecretsForm
            userId={userRecovery.user.id}
            username={userRecovery.user.username}
            questions={userRecovery.questions}
            onConfirm={setCanChangePassword}
          />
        )}

        {userRecovery && canChangePassword && (
          <NewPasswordForm username={userRecovery.user.username} userId={userRecovery.user.id} />
        )}
      </Flex>
    </>
  )
}

export default UserRecovery
