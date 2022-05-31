import { useQuery } from 'react-query';
import { api } from '../services/api';

type Championship = {
  id: number;
  master_id: number;
  date: Date;
  athlete_id: number[];
  description: string;
};

export async function getChampionships(): Promise<Championship[]> {
  const championships = await api
    .get('/championships')
    .then((response) => response.data as Championship[]);
  return championships;
}

export function useChampionships() {
  return useQuery('championships', () => getChampionships(), {
    staleTime: 1000 * 5,
  });
}
