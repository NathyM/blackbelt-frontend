/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import Link from 'next/link';
import Router from 'next/router';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Input } from '../../components/Input';
import { MainContainer } from '../../components/MainContainer';
import { AuthContext } from '../../contexts/AuthContext';
import { useStudents } from '../../hooks/useStudents';
import { api } from '../../services/api';
import { withSSRAuth } from '../../utils/withSSRAuth';

type ClassFormData = {
  date: Date;
  time: String;
  description: string;
};

const classFormSchema = yup.object({
  date: yup
    .date()
    .required('O campo data é obrigatório')
    .typeError('O campo data é obrigatório'),
  time: yup.string().required('O campo hora é obrigatório'),
  description: yup.string().required('O campo descrição é obrigatório.'),
});

export default function ClassForm() {
  const { data, isLoading, error } = useStudents();
  const [students, setStudents] = useState([] as number[]);
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(classFormSchema),
    mode: 'onTouched',
  });

  const handleCreate: SubmitHandler<ClassFormData> = async (values, event) => {
    event.preventDefault();
    try {
      const hoursToAdd = Number(values.time.split(':')[0]);
      const minutesToAdd = Number(values.time.split(':')[1]);
      let newTime = dayjs(values.date).add(hoursToAdd, 'h');
      newTime = newTime.add(minutesToAdd, 'm');
      const newClass = {
        date: newTime,
        master_id: user.id,
        description: values.description,
        students_id: students,
      };
      await api.post('/classes', newClass);
      toast.success('Aula criada com sucesso!');
      Router.push('/classes');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <MainContainer>
      <Flex mb="8" justify="space-between" w="100%">
        <Heading size="lg">Aulas</Heading>
      </Flex>
      <Box w="100%" as="form" onSubmit={handleSubmit(handleCreate)}>
        <Stack spacing={['6', '8']}>
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Input
              id="date"
              label="DATA"
              defaultValue={dayjs().format('YYYY-MM-DD')}
              inputType="date"
              error={errors.date}
              {...register('date')}
            />
            <Input
              id="time"
              label="HORA"
              inputType="time"
              error={errors.time}
              {...register('time')}
            />
          </SimpleGrid>
          <Input
            id="description"
            label="DESCRIÇÃO"
            inputType="text"
            placeholder="digite a descrição da aula"
            error={errors.description}
            {...register('description')}
          />
        </Stack>
        {isLoading ? (
          <Flex justify="center" mt="2rem">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center" mt="2rem">
            Falha ao obter dados dos usuários.
          </Flex>
        ) : (
          <Table size="sm" mt="2rem">
            <Thead>
              <Th />
              <Th isNumeric />
            </Thead>
            <Tbody>
              {data.map((student) => (
                <Tr>
                  <Td>
                    <Flex align="center">
                      <Avatar
                        size="sm"
                        name={`${student.first_name} ${student.last_name}`}
                        bg={useColorModeValue('blackbelt.500', 'blackbelt.200')}
                        color={useColorModeValue('gray.50', 'gray.800')}
                        mr="0.5rem"
                      />
                      <Text>
                        {student.first_name} {student.last_name}
                      </Text>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStudents([...students, student.id]);
                        } else {
                          setStudents(
                            students.filter((value) => value !== student.id),
                          );
                        }
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        <ButtonGroup w="100%" mt="3rem" ml="auto">
          <Link href="/classes" passHref>
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

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
