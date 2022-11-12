import { Divider, Flex, Skeleton } from '@chakra-ui/react'

export const SettingsSidebarSkeleton = () => {
  return (
    <>
      <Flex as="ul" direction="column" gap={4} listStyleType="none">
        <Skeleton height="10" rounded="md" startColor="whiteAlpha.200" />
        <Skeleton height="10" rounded="md" startColor="whiteAlpha.200" />
        <Skeleton height="10" rounded="md" startColor="whiteAlpha.200" />
        <Skeleton height="10" rounded="md" startColor="whiteAlpha.200" />
        <Skeleton height="10" rounded="md" startColor="whiteAlpha.200" />
      </Flex>
      <Divider mt={4} display={['block', 'none']} />
    </>
  )
}
