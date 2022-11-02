import {
  Button,
  Checkbox,
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
import {
  CancelButton,
  CreateButton,
  PersonForm,
  PersonFormData,
  personFormSchema,
  SaveButton
} from 'components/app'
import { useMatchMutate, userKeysMatcher } from 'hooks'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { BsArrowRight } from 'react-icons/bs'
import { createUser } from 'services/users'
import { PersonSelectForm, PersonSelectFormData, personSelectFormSchema } from './PersonSelectForm'
import { UserForm, UserFormData, userFormSchema, UserFormSubmitHandler } from './UserForm'

export const CreateUserModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isNewPerson, setIsNewPerson] = useState(true)
  const [person, setPerson] = useState<number | PersonFormData>()
  const [formStep, setFormStep] = useState(0)
  const toast = useToast()
  const matchMutate = useMatchMutate()

  const userFormHook = useForm<UserFormData>({ resolver: zodResolver(userFormSchema) })

  const personFormHook = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema),
    shouldUnregister: true,
    mode: 'onChange'
  })

  const personSelectFormHook = useForm<PersonSelectFormData>({
    resolver: zodResolver(personSelectFormSchema),
    shouldUnregister: true,
    mode: 'onChange'
  })

  const onCreate: UserFormSubmitHandler = async (data) => {
    if (!person) return
    try {
      await createUser({ ...data, person })
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
                <Tab isDisabled={formStep === 0}>2. Datos de acceso</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Checkbox
                    defaultChecked={isNewPerson}
                    checked={isNewPerson}
                    onChange={(e) => setIsNewPerson(e.target.checked)}
                    mb={4}
                  >
                    Es una nueva persona
                  </Checkbox>

                  {isNewPerson && (
                    <FormProvider {...personFormHook}>
                      <PersonForm
                        id="PersonForm"
                        onSubmit={personFormHook.handleSubmit((data) => {
                          setFormStep(1)
                          setPerson(data)
                        })}
                      />
                    </FormProvider>
                  )}

                  {!isNewPerson && (
                    <PersonSelectForm
                      id="PersonIdForm"
                      formHook={personSelectFormHook}
                      onSubmit={(data) => {
                        setFormStep(1)
                        setPerson(data.personId)
                      }}
                    />
                  )}
                </TabPanel>

                <TabPanel>
                  <UserForm formHook={userFormHook} onSubmit={onCreate} id="UserForm" />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <CancelButton mr="auto" onClick={onClose} />

            {formStep === 0 && (
              <Button
                colorScheme="blue"
                leftIcon={<BsArrowRight />}
                type="submit"
                form={isNewPerson ? 'PersonForm' : 'PersonIdForm'}
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
