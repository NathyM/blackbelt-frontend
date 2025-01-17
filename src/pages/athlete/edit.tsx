import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import Link from 'next/link';
import Router from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Input } from '../../components/Input';
import { MainContainer } from '../../components/MainContainer';
import { api, setupApiClient } from '../../services/api';
import { withSSRAuth } from '../../utils/withSSRAuth';

type Athlete = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  phone: string;
  birthdate: Date;
  belt: string;
  level: number;
  time: string;
  gender: string;
  weight: string;
};

type AthleteFormData = Omit<Athlete, 'id'>;

type AthleteEditProps = {
  athlete: Athlete;
};

const athleteFormSchema = yup.object({
  first_name: yup.string().required('O campo primeiro nome é obrigatório.'),
  last_name: yup.string().required('O campo ultimo nome é obrigatório.'),
  email: yup
    .string()
    .required('O campo e-mail é obrigatório.')
    .email('E-mail inválido.'),
  cpf: yup
    .string()
    .required('O campo cpf é obrigatório.')
    .min(14, 'Digite um CPF válido.')
    .max(14, 'Digite um CPF válido.'),
  phone: yup
    .string()
    .required('O campo telefone é obrigatório.')
    .min(14, 'Digite um telefone válido, incluindo DDD.')
    .max(15, 'Digite um telefone válido, incluindo DDD.'),
  gender: yup.string().required('O campo gênero é obrigatório'),
  weight: yup.string().required('O campo peso é obrigatório'),
  time: yup.string().required('O campo time é obrigatório'),
  birthdate: yup
    .date()
    .required('O campo data de nascimento é obrigatório')
    .typeError('O campo data de nascimento é obrigatório')
    .max(new Date(), 'Não é possível incluir uma data futura'),
  belt: yup.string(),
  level: yup.number(),
});

export default function AthleteEdit({ athlete }: AthleteEditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(athleteFormSchema),
    mode: 'onTouched',
  });

  const handleCreate: SubmitHandler<AthleteFormData> = async (
    values,
    event,
  ) => {
    event.preventDefault();
    try {
      await api.put(`/athlete/${athlete.id}`, values);
      toast.success('Cadastro atualizado com sucesso!');
      Router.push('/athlete');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <MainContainer>
      <Flex mb="8" justify="space-between" w="100%">
        <Heading size="lg">Editar Atleta</Heading>
      </Flex>
      <Box w="100%" as="form" onSubmit={handleSubmit(handleCreate)}>
        <Stack spacing={['6', '8']}>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Input
              id="first_name"
              label="PRIMEIRO NOME"
              inputType="text"
              placeholder="digite o primeiro nome"
              error={errors.first_name}
              {...register('first_name')}
            />
            <Input
              id="last_name"
              label="ULTIMO NOME"
              inputType="text"
              placeholder="digite o ultimo sobrenome"
              error={errors.last_name}
              {...register('last_name')}
            />
          </SimpleGrid>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Input
              id="email"
              label="E-MAIL"
              inputType="email"
              placeholder="digite o email"
              error={errors.email}
              {...register('email')}
            />
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
          </SimpleGrid>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Input
              as={InputMask}
              id="phone"
              label="TELEFONE"
              inputType="text"
              placeholder="(00) 00000-0000"
              mask="(99) 99999-9999"
              maskChar={null}
              error={errors.phone}
              {...register('phone')}
            />
            <Input
              id="birthdate"
              label="DATA DE NASCIMENTO"
              inputType="date"
              error={errors.birthdate}
              {...register('birthdate')}
              defaultValue={dayjs(athlete.birthdate).format('YYYY-MM-DD')}
            />
          </SimpleGrid>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <FormControl id="belt">
              <FormLabel
                fontWeight="bold"
                color={useColorModeValue('blackbelt.500', 'blackbelt.200')}
              >
                FAIXA
              </FormLabel>
              <Select
                size="sm"
                variant="flushed"
                placeholder="Selecione a Faixa"
                error={errors.belt}
                {...register('belt')}
              >
                <option value="Branca">Branca</option>
                <option value="Cinza e Branca">Cinza e Branca</option>
                <option value="Cinza">Cinza</option>
                <option value="Cinza e Preta">Cinza e Preta</option>
                <option value="Amarela e Branca">Amarela e Branca</option>
                <option value="Amarela">Amarela</option>
                <option value="Amarela e Preta">Amarela e Preta</option>
                <option value="Laranja e Branca">Laranja e Branca</option>
                <option value="Laranja">Laranja</option>
                <option value="Laranja e Preta">Laranja e Preta</option>
                <option value="Verde e Branca">Verde e Branca</option>
                <option value="Verde">Verde</option>
                <option value="Verde e Preta">Verde e Preta</option>
              </Select>
            </FormControl>
            <FormControl id="belt">
              <FormLabel
                fontWeight="bold"
                color={useColorModeValue('blackbelt.500', 'blackbelt.200')}
              >
                GRAU
              </FormLabel>
              <Select
                size="sm"
                variant="flushed"
                placeholder="Selecione o grau"
                error={errors.level}
                {...register('level')}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
              </Select>
            </FormControl>
          </SimpleGrid>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <FormControl id="gender">
              <FormLabel
                fontWeight="bold"
                color={useColorModeValue('blackbelt.500', 'blackbelt.200')}
              >
                GÊNERO
              </FormLabel>
              <Select
                size="sm"
                variant="flushed"
                placeholder="Selecione o gênero"
                error={errors.gender}
                {...register('gender')}
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </Select>
            </FormControl>
          </SimpleGrid>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <FormControl id="weight">
              <FormLabel
                fontWeight="bold"
                color={useColorModeValue('blackbelt.500', 'blackbelt.200')}
              >
                PESO
              </FormLabel>
              <Select
                size="sm"
                variant="flushed"
                placeholder="Selecione o gênero"
                error={errors.weight}
                {...register('weight')}
              >
                <option value="Mosca - 51kg">Mosca - 51 kg</option>
                <option value="Galo - 54kg">Galo - 54 kg</option>
                <option value="Pena - 57kg">Pena - 57 kg</option>
                <option value="Leve - 60kg">Leve - 60 kg</option>
                <option value="Meio-medio">Meio médio - 69 kg</option>
                <option value="Medio">Médio - 75 kg</option>
                <option value="Meio-pesado">Meio pesado - 81 kg</option>
                <option value="Pesado">Pesado - 91 kg</option>
              </Select>
            </FormControl>
          </SimpleGrid>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Input
              id="time"
              label="TIME"
              inputType="text"
              placeholder="digite o nome do time"
              error={errors.time}
              {...register('time')}
            />
          </SimpleGrid>
        </Stack>
        <ButtonGroup w="100%" mt="3rem" ml="auto">
          <Link href="/athlete" passHref>
            <Button
              as="a"
              colorScheme="blackbelt"
              variant="outline"
              ml="auto"
              w={['calc(50% - 0.25rem)', '8rem']}
            >
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="blackbelt"
            w={['calc(50% - 0.25rem)', '8rem']}
          >
            Cadastrar
          </Button>
        </ButtonGroup>
      </Box>
    </MainContainer>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const athleteId = ctx.query.id;
  const api = setupApiClient(ctx);
  const response = await api.get(`/athlete/${athleteId}`);
  const athlete = response.data;

  return {
    props: { athlete },
  };
});
