/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
import { Box, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { AthletesPerBeltChart } from '../components/Charts/athletesPerBelt';
import { MainContainer } from '../components/MainContainer';
import { setupApiClient } from '../services/api';
import { withSSRAuth } from '../utils/withSSRAuth';

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

type DashboardProps = {
  totalAthletes: number;
  athletesPerBelt: {
    Branca: number;
    'Cinza e Branca': number;
    Cinza: number;
    'Cinza e Preta': number;
    'Amarela e Branca': number;
    Amarela: number;
    'Amarela e Preta': number;
    'Laranja e Branca': number;
    Laranja: number;
    'Laranja e Preta': number;
    'Verde e Branca': number;
    Verde: number;
    'Verde e Preta': number;
  };
};

export default function Dashboard({
  totalAthletes,
  athletesPerBelt,
}: DashboardProps) {
  return (
    <MainContainer>
      <Stack spacing="1rem">
        <Box
          p={['4', '8']}
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderRadius="8px"
          pb="4"
        >
          <Text textAlign="right" fontSize="lg">
            <Text as="span" fontWeight="bold" fontSize="2xl">
              {totalAthletes}
            </Text>{' '}
            atletas cadastrados
          </Text>
        </Box>
        <Box
          p={['4', '8']}
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderRadius="8px"
          pb="4"
        >
          <Flex maxW="600px" mx="auto">
            <AthletesPerBeltChart athletesPerBelt={athletesPerBelt} />
          </Flex>
        </Box>
      </Stack>
    </MainContainer>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const api = setupApiClient(ctx);
  const response = await api.get(`/athlete`);
  const athletes = response.data as Athlete[];


  const athletesPerBelt = athletes.reduce((groups, athlete) => {
    const group = groups[athlete.belt] || 0;
    groups[athlete.belt] = group + 1;
    return groups;
  }, {});

  return {
    props: { totalAthletes: athletes.length, athletesPerBelt},
  };
});
