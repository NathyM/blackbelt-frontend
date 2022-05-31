/* eslint-disable prettier/prettier */
import {
  Avatar,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  IconButton,
  Table,
  Tbody,
  Text,
  Th,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import router from 'next/router';
import { FiEdit } from 'react-icons/fi';
import { IoArrowBack, IoTrashOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { MainContainer } from '../../components/MainContainer';
import { setupApiClient } from '../../services/api';
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
  time:string;
  gender: string;
  weight: string;
};

type ProfileProps = {
  athlete: Athlete;
};

export default function AthleteProfile({ athlete }: ProfileProps) {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  });

  function onEdit() {
    router.push({ pathname: '/athlete/edit', query: { id: athlete.id } });
  }

  async function onRemove() {
    try {
      if (
        window.confirm(
          'Tem certeza que deseja remover esse atleta? Essa ação é irreversível.',
        )
      ) {
        const api = setupApiClient();
        await api.delete(`/athlete/${athlete.id}`);
        toast.success('Atleta removido com sucesso.');
        router.push('/athlete');
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  return (
    <MainContainer>
      <Flex mb="8" justify="space-between" w="100%">
        <Heading size="lg">Perfil do Atleta</Heading>
        <ButtonGroup>
          <Link href="/athlete" passHref>
            {isWideVersion ? (
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                leftIcon={<Icon as={IoArrowBack} />}
              >
                Voltar
              </Button>
            ) : (
              <IconButton
                icon={<Icon as={IoArrowBack} fontSize="xl" />}
                aria-label="Voltar"
                size="sm"
              />
            )}
          </Link>
          {isWideVersion ? (
            <Button
              size="sm"
              fontSize="sm"
              colorScheme="blackbelt"
              leftIcon={<Icon as={FiEdit} />}
              onClick={onEdit}
            >
              Editar
            </Button>
          ) : (
            <IconButton
              icon={<Icon as={FiEdit} fontSize="xl" />}
              aria-label="Editar"
              colorScheme="blackbelt"
              size="sm"
              onClick={onEdit}
            />
          )}
        </ButtonGroup>
      </Flex>
      <Flex direction="column" align="center">
        <Avatar
          size="2xl"
          name={`${athlete.first_name} ${athlete.last_name}`}
          bg={useColorModeValue('blackbelt.500', 'blackbelt.200')}
          color={useColorModeValue('gray.50', 'gray.800')}
          mb="1.5rem"
        />
        <Text fontSize="xl" mb="2rem">
          {athlete.first_name} {athlete.last_name}
        </Text>
        <Table>
          <Tbody>
            <Tr>
              <Th>FAIXA</Th>
              <Th>{athlete.belt}</Th>
            </Tr>
            <Tr>
              <Th>GRAU</Th>
              <Th>{athlete.level}</Th>
            </Tr>
            <Tr>
              <Th>CPF</Th>
              <Th>{athlete.cpf}</Th>
            </Tr>
            <Tr>
              <Th>TELEFONE</Th>
              <Th>{athlete.phone}</Th>
            </Tr>
            <Tr>
              <Th>EMAIl</Th>
              <Th>{athlete.email}</Th>
            </Tr>
            <Tr>
              <Th>DATA DE NASCIMENTO</Th>
              <Th>{dayjs(athlete.birthdate).format('DD/MM/YYYY')}</Th>
            </Tr>
            <Tr>
              <Th>TIME</Th>
              <Th>{athlete.time}</Th>
            </Tr>
            <Tr>
              <Th>GÊNERO</Th>
              <Th>{athlete.gender}</Th>
            </Tr>
            <Tr>
              <Th>Peso - Categoria</Th>
              <Th>{athlete.weight}</Th>
            </Tr>
          </Tbody>
        </Table>
        {isWideVersion ? (
          <Button
            variant="outline"
            colorScheme="red"
            mt="3rem"
            mr="auto"
            size="sm"
            leftIcon={<Icon as={IoTrashOutline} />}
            onClick={onRemove}
          >
            Remover Atleta
          </Button>
        ) : (
          <IconButton
            icon={<Icon as={IoTrashOutline} fontSize="xl" />}
            aria-label="Remover"
            variant="outline"
            colorScheme="red"
            size="sm"
            mt="3rem"
            mr="auto"
            onClick={onRemove}
          />
        )}
      </Flex>
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