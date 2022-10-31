import { HeadingWithSearch } from 'components/app'
import { BaseLayout } from 'components/layouts'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export const CommunityLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  return (
    <BaseLayout>
      <Head>
        <title>Comunidad</title>
      </Head>
      <HeadingWithSearch
        title="Comunidad"
        placeholder="Cédula"
        onSubmit={({ text }) => {
          router.push(`/comunidad/${text}`)
        }}
      />
      {children}
    </BaseLayout>
  )
}
