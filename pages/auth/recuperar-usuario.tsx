import { Divider, Flex, Heading } from '@chakra-ui/react'
import { NewPasswordForm, SearchUserForm, SecretsForm } from 'components/auth/password-recovery'
import Head from 'next/head'
import { useState } from 'react'
import { GetUserSecretResponse } from 'services/auth'
import { NextPageWithLayout } from '../_app'

const UserRecovery: NextPageWithLayout = () => {
  const [userRecovery, setUserRecovery] = useState<GetUserSecretResponse>()
  const [canChangePassword, setCanChangePassword] = useState(false)

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
        h="100vh"
        p={4}
        direction="column"
        gap={6}
      >
        <Heading as="h1" textAlign="center" w="full" mb={4}>
          SCIU
          <Divider />
          Recuperar acceso
        </Heading>

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
