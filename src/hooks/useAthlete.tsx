/* eslint-disable prettier/prettier */
import { useQuery } from 'react-query';
import { api } from '../services/api';

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


export async function getAthlete(): Promise<Athlete[]> {
  const athlete = await api
    .get('/athlete')
    .then((response) => response.data as Athlete[]);
  return athlete;
}

export function useAthlete() {
  return useQuery('athlete', () => getAthlete(), {
    staleTime: 1000 * 5,
  });
}
