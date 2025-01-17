import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Heading,
  Link,
  Stack,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { TiLockClosed, TiUser } from 'react-icons/ti';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { ColorModeToggle } from '../components/ColorModeToggle';
import { Input } from '../components/Input';
import { RadioGroup } from '../components/RadioGroup';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { withSSRGuest } from '../utils/withSSRGuest';

type RegisterFormData = {
  error_trigger: string; // workaround to react-hook-forms not validating correctly on first trigger call
  role: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  cpf: string;
  birthdate: Date;
};

const registerFormSchema = yup.object({
  error_trigger: yup.string(), // workaround to react-hook-forms not validating correctly on first trigger call
  role: yup.string().required(),
  email: yup
    .string()
    .required('O campo e-mail é obrigatório.')
    .email('E-mail inválido.'),
  password: yup
    .string()
    .required('O campo senha é obrigatório.')
    .min(6, 'A senha deve conter ao menos 6 caracteres.'),
  password_confirmation: yup
    .string()
    .required('O campo confirmação de senha é obrigatório.')
    .oneOf([null, yup.ref('password')], 'As senhas não conferem.'),
  first_name: yup.string().required('O campo primeiro nome é obrigatório.'),
  last_name: yup.string().required('O campo ultimo nome é obrigatório.'),
  cpf: yup
    .string()
    .required('O campo cpf é obrigatório.')
    .min(14, 'Digite um CPF válido.')
    .max(14, 'Digite um CPF válido.'),
  birthdate: yup
    .date()
    .required('O campo data de nascimento é obrigatório')
    .typeError('O campo data de nascimento é obrigatório')
    .max(new Date(), 'Não é possível incluir uma data futura'),
});

export default function Register() {
  const { signIn } = useContext(AuthContext);
  const [tabIndex, setTabIndex] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerFormSchema),
    mode: 'onTouched',
  });
  const watchRole = watch('role');

  // workaround to react-hook-forms not validating correctly on first trigger call
  useEffect(() => {
    trigger('error_trigger');
  }, []);

  const handleRegister: SubmitHandler<RegisterFormData> = async (
    values,
    event,
  ) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { password_confirmation, ...user } = values;
    try {
      await api.post('/register', user);
      toast.success('Cadastro realizado com sucesso!');
      signIn(user);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const handleNextTab = () => {
    setTabIndex(tabIndex + 1);
  };

  const handlePrevTab = () => {
    setTabIndex(tabIndex - 1);
  };

  return (
    <Flex w="100vw" h="100vh" direction="column">
      <Flex
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
        direction="column"
        mb="50px"
      >
        <Flex
          as="form"
          w="100%"
          maxW="360px"
          p="8"
          border={['0px', '1px']}
          borderColor={[
            'transparent',
            useColorModeValue('gray.200', 'gray.500'),
          ]}
          boxShadow={['none', 'base']}
          borderRadius="xl"
          flexDir="column"
          onSubmit={handleSubmit(handleRegister)}
        >
          <Heading as="h1" fontSize="28">
            Bem vindo ao Blackbelt
          </Heading>
          <Text mt="0.25rem" color="gray.400">
            Olá, seja bem vindo ao Blackbelt! Você poderá utilizar a aplicação
            assim que concluir o seu registro.
          </Text>

          <Tabs
            mt="1.5rem"
            variant="soft-rounded"
            colorScheme="gray"
            index={tabIndex}
            onChange={handleTabChange}
          >
            <TabPanels>
              <TabPanel px="0px">
                <Box minH="250px">
                  <Heading
                    as="h2"
                    fontSize="1rem"
                    color={useColorModeValue('blackbelt.500', 'blackbelt.200')}
                    mb="1rem"
                  >
                    QUEM É VOCÊ?
                  </Heading>
                  <FormControl id="role">
                    <RadioGroup
                      id="role"
                      {...register('role')}
                      options={['Mestre', 'Aluno', 'Atleta']}
                    />
                  </FormControl>
                </Box>
                <ButtonGroup w="100%" mt="3rem">
                  <Button
                    w="calc(50% - 0.25rem)"
                    colorScheme="blackbelt"
                    onClick={handleNextTab}
                    ml="auto"
                    rightIcon={<IoChevronForward />}
                  >
                    Próximo
                  </Button>
                </ButtonGroup>
              </TabPanel>
              {/* Paineis de Registo do Mestre! */}
              {watchRole === 'Mestre' && (
                <TabPanel px="0px">
                  <Box minH="250px">
                    <Stack spacing="6">
                      <Input
                        id="email"
                        label="EMAIL"
                        inputType="email"
                        icon={TiUser}
                        placeholder="digite seu e-mail"
                        error={errors.email}
                        {...register('email')}
                      />
                      <Input
                        id="password"
                        label="SENHA"
                        inputType="password"
                        icon={TiLockClosed}
                        placeholder="digite sua senha"
                        error={errors.password}
                        {...register('password')}
                      />
                      <Input
                        id="password_confirmation"
                        label="CONFIRME SUA SENHA"
                        inputType="password"
                        icon={TiLockClosed}
                        placeholder="digite sua senha"
                        error={errors.password_confirmation}
                        {...register('password_confirmation')}
                      />
                    </Stack>
                  </Box>
                  <ButtonGroup w="100%" mt="3rem">
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      variant="outline"
                      onClick={handlePrevTab}
                      leftIcon={<IoChevronBack />}
                    >
                      Anterior
                    </Button>
                    <Button
                      colorScheme="blackbelt"
                      onClick={async () => {
                        await trigger([
                          'email',
                          'password',
                          'password_confirmation',
                        ]);
                        if (
                          !errors.password_confirmation &&
                          !errors.password &&
                          !errors.email
                        ) {
                          handleNextTab();
                        }
                      }}
                      w="100%"
                      rightIcon={<IoChevronForward />}
                    >
                      Próximo
                    </Button>
                  </ButtonGroup>
                </TabPanel>
              )}
              {watchRole === 'Mestre' && (
                <TabPanel px="0px">
                  <Box minH="250px">
                    <Stack spacing="6">
                      <Input
                        as={InputMask}
                        id="cpf"
                        label="CPF"
                        inputType="text"
                        placeholder="000.000.000-00"
                        mask="999.999.999-99"
                        maskChar={null}
                        error={errors.cpf}
                        {...register('cpf')}
                      />
                      <Input
                        id="birthdate"
                        label="DATA DE NASCIMENTO"
                        inputType="date"
                        error={errors.birthdate}
                        {...register('birthdate')}
                      />
                    </Stack>
                  </Box>
                  <ButtonGroup w="100%" mt="3rem">
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      variant="outline"
                      onClick={handlePrevTab}
                      leftIcon={<IoChevronBack />}
                    >
                      Anterior
                    </Button>
                    <Button
                      colorScheme="blackbelt"
                      onClick={async () => {
                        await trigger([
                          'cpf',
                          'birthdate',
                          'password_confirmation',
                        ]);
                        if (!errors.cpf && !errors.birthdate) {
                          handleNextTab();
                        }
                      }}
                      w="100%"
                      rightIcon={<IoChevronForward />}
                    >
                      Próximo
                    </Button>
                  </ButtonGroup>
                </TabPanel>
              )}
              {watchRole === 'Mestre' && (
                <TabPanel px="0px">
                  <Box minH="250px">
                    <Stack spacing="6">
                      <Input
                        id="first_name"
                        label="PRIMEIRO NOME"
                        inputType="text"
                        placeholder="digite seu nome"
                        error={errors.first_name}
                        {...register('first_name')}
                      />
                      <Input
                        id="last_name"
                        label="ULTIMO NOME"
                        inputType="text"
                        placeholder="digite seu ultimo sobrenome"
                        error={errors.last_name}
                        {...register('last_name')}
                      />
                    </Stack>
                  </Box>
                  <ButtonGroup w="100%" mt="3rem">
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      variant="outline"
                      onClick={handlePrevTab}
                      leftIcon={<IoChevronBack />}
                    >
                      Anterior
                    </Button>
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Registrar
                    </Button>
                  </ButtonGroup>
                </TabPanel>
              )}
              {/* Paineis de Registo do Aluno! */}
              {watchRole === 'Aluno' && (
                <TabPanel px="0px">
                  <Box minH="250px">
                    <Stack spacing="6">
                      <Input
                        id="email"
                        label="EMAIL"
                        inputType="email"
                        icon={TiUser}
                        placeholder="digite seu e-mail"
                        error={errors.email}
                        {...register('email')}
                      />
                      <Input
                        id="password"
                        label="SENHA"
                        inputType="password"
                        icon={TiLockClosed}
                        placeholder="digite sua senha"
                        error={errors.password}
                        {...register('password')}
                      />
                      <Input
                        id="password_confirmation"
                        label="CONFIRME SUA SENHA"
                        inputType="password"
                        icon={TiLockClosed}
                        placeholder="digite sua senha"
                        error={errors.password_confirmation}
                        {...register('password_confirmation')}
                      />
                    </Stack>
                  </Box>
                  <ButtonGroup w="100%" mt="3rem">
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      variant="outline"
                      onClick={handlePrevTab}
                      leftIcon={<IoChevronBack />}
                    >
                      Anterior
                    </Button>
                    <Button
                      colorScheme="blackbelt"
                      onClick={async () => {
                        await trigger([
                          'email',
                          'password',
                          'password_confirmation',
                        ]);
                        if (
                          !errors.password_confirmation &&
                          !errors.password &&
                          !errors.email
                        ) {
                          handleNextTab();
                        }
                      }}
                      w="100%"
                      rightIcon={<IoChevronForward />}
                    >
                      Próximo
                    </Button>
                  </ButtonGroup>
                </TabPanel>
              )}
              {watchRole === 'Aluno' && (
                <TabPanel px="0px">
                  <Box minH="250px">
                    <Stack spacing="6">
                      <Input
                        as={InputMask}
                        id="cpf"
                        label="CPF"
                        inputType="text"
                        placeholder="000.000.000-00"
                        mask="999.999.999-99"
                        maskChar={null}
                        error={errors.cpf}
                        {...register('cpf')}
                      />
                      <Input
                        id="birthdate"
                        label="DATA DE NASCIMENTO"
                        inputType="date"
                        error={errors.birthdate}
                        {...register('birthdate')}
                      />
                    </Stack>
                  </Box>
                  <ButtonGroup w="100%" mt="3rem">
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      variant="outline"
                      onClick={handlePrevTab}
                      leftIcon={<IoChevronBack />}
                    >
                      Anterior
                    </Button>
                    <Button
                      colorScheme="blackbelt"
                      onClick={async () => {
                        await trigger([
                          'cpf',
                          'birthdate',
                          'password_confirmation',
                        ]);
                        if (!errors.cpf && !errors.birthdate) {
                          handleNextTab();
                        }
                      }}
                      w="100%"
                      rightIcon={<IoChevronForward />}
                    >
                      Próximo
                    </Button>
                  </ButtonGroup>
                </TabPanel>
              )}
              {watchRole === 'Aluno' && (
                <TabPanel px="0px">
                  <Box minH="250px">
                    <Stack spacing="6">
                      <Input
                        id="first_name"
                        label="PRIMEIRO NOME"
                        inputType="text"
                        placeholder="digite seu nome"
                        error={errors.first_name}
                        {...register('first_name')}
                      />
                      <Input
                        id="last_name"
                        label="ULTIMO NOME"
                        inputType="text"
                        placeholder="digite seu ultimo sobrenome"
                        error={errors.last_name}
                        {...register('last_name')}
                      />
                    </Stack>
                  </Box>
                  <ButtonGroup w="100%" mt="3rem">
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      variant="outline"
                      onClick={handlePrevTab}
                      leftIcon={<IoChevronBack />}
                    >
                      Anterior
                    </Button>
                    <Button
                      w="100%"
                      colorScheme="blackbelt"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Registrar
                    </Button>
                  </ButtonGroup>
                </TabPanel>
              )}
              {/* Paineis de Registo do Atleta! */}
              {watchRole === 'Atleta' && (
                <TabPanel px="0px">
                  <Box minH="250px">
                    <Text>
                      Nesse momento o cadastro do atleta ainda não está
                      disponível.
                    </Text>
                  </Box>
                  <ButtonGroup w="100%" mt="3rem">
                    <Button
                      w="calc(50% - 0.25rem)"
                      colorScheme="blackbelt"
                      variant="outline"
                      onClick={handlePrevTab}
                      leftIcon={<IoChevronBack />}
                    >
                      Anterior
                    </Button>
                  </ButtonGroup>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Flex>
        <Text mt="1.5rem">
          Já possui conta?
          <Link
            href="/"
            ml="0.25rem"
            fontWeight="bold"
            color={useColorModeValue('blackbelt.500', 'blackbelt.200')}
          >
            Entre
          </Link>
        </Text>
      </Flex>
      <ColorModeToggle mt="auto" ml="auto" m="4" />
    </Flex>
  );
}

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
