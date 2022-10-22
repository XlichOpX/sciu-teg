import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CancelButton, CreateButton, SaveButton } from 'components/app'
import { useMatchMutate, userKeysMatcher } from 'hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsArrowRight } from 'react-icons/bs'
import { createUser } from 'services/users'
import { PersonForm, PersonFormData, personFormSchema } from './PersonForm'
import { UserForm, UserFormData, userFormSchema, UserFormSubmitHandler } from './UserForm'

export const CreateUserModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [formStep, setFormStep] = useState(0)
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const userFormHook = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema)
  })

  const personFormHook = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema),
    shouldUnregister: true,
    mode: 'onChange'
  })

  const onCreate: UserFormSubmitHandler = async (data) => {
    const isPersonValid = await personFormHook.trigger()
    if (!isPersonValid) return

    const personData = personFormHook.getValues()
    let personValue

    if (personData.isNewPerson && personData.person) {
      personValue = personData.person
    } else if (personData.personId) {
      personValue = personData.personId
    } else {
      return
    }

    try {
      await createUser({ ...data, person: personValue })
      await matchMutate(userKeysMatcher)
      toast({ status: 'success', description: 'Usuario creado con éxito' })
      onClose()
    } catch {
      toast({ status: 'error', description: 'Ocurrió un error al crear el usuario' })
    }
  }

  return (
    <>
      <CreateButton colorScheme="blue" onClick={onOpen}>
        Crear usuario
      </CreateButton>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2>Crear usuario</h2>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Tabs index={formStep} onChange={(index) => setFormStep(index)}>
              <TabList>
                <Tab>1. Datos personales</Tab>
                <Tab isDisabled={!personFormHook.formState.isValid}>2. Datos de acceso</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <PersonForm
                    formHook={personFormHook}
                    onSubmit={() => setFormStep(1)}
                    id="PersonForm"
                  />
                </TabPanel>

                <TabPanel>
                  <UserForm formHook={userFormHook} onSubmit={onCreate} id="UserForm" />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <CancelButton mr={3} onClick={onClose} />

            {formStep === 0 && (
              <Button
                colorScheme="blue"
                leftIcon={<BsArrowRight />}
                type="submit"
                form="PersonForm"
              >
                Siguiente
              </Button>
            )}

            {formStep === 1 && <SaveButton type="submit" form="UserForm" />}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
