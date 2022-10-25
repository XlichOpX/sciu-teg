import { UserStatus } from '@prisma/client'
import { fetch } from 'lib/fetch'

/** The backend sets a cookie with the permission to read user recovery questions */
export const getRecoveryCookie = async (username: string) =>
  await fetch(`/api/auth/recovery?username=${username}`)

/** Get the user secret questions */
export const getUserSecret = async (username: string) => {
  const res = (await fetch(`/api/secret?username=${username}`)) as {
    id: number
    user: {
      username: string
      id: number
    }
    questionOne: string
    questionTwo: string
    questionThree: string
  }

  const { id, questionOne, questionTwo, questionThree, user } = res

  return {
    questions: { id, questionOne, questionTwo, questionThree },
    user
  }
}
export type GetUserSecretResponse = Awaited<ReturnType<typeof getUserSecret>>
export type SecretQuestions = GetUserSecretResponse['questions']

export const confirmAnswers = async (answers: {
  id: number
  username: string
  answerOne: string
  answerTwo: string
  answerThree: string
}) => {
  const res = (await fetch('/api/auth/recovery', { method: 'POST', body: answers })) as {
    ok: boolean
  }
  return res.ok
}

export const updatePassword = async (
  userId: number,
  newPassword: { password: string; passwordConfirm: string }
) => {
  return (await fetch(`/api/user/${userId}`, { method: 'PUT', body: newPassword })) as {
    id: number
    username: string
    status: UserStatus
    roles: {
      id: number
      description: string
      name: string
    }[]
  }
}
