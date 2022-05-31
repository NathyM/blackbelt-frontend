/* eslint-disable @typescript-eslint/dot-notation */
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

type ChartProps = {
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

export function AthletesPerBeltChart({ athletesPerBelt }: ChartProps) {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        color: 'white',
        font: { size: '18' },
        textShadowBlur: 5,
        textShadowColor: 'rgb(0, 0, 0)',
      },
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Atletas por Faixa',
      },
    },
  };

  const data = {
    labels: [
      'Branca',
      'Cinza e Branca',
      'Cinza',
      'Cinza e Preta',
      'Amarela e Branca',
      'Amarela',
      'Amarela e Preta',
      'Laranja e Branca',
      'Laranja',
      'Laranja e Preta',
      'Verde e Branca',
      'Verde',
      'Verde e Preta',
    ],
    datasets: [
      {
        label: 'Atletas por Faixa',
        data: [
          athletesPerBelt['Branca'],
          athletesPerBelt['Cinza e Branca'],
          athletesPerBelt['Cinza'],
          athletesPerBelt['Cinza e Preta'],
          athletesPerBelt['Amarela e Branca'],
          athletesPerBelt['Amarela'],
          athletesPerBelt['Amarela e Preta'],
          athletesPerBelt['Laranja e Branca'],
          athletesPerBelt['Laranja'],
          athletesPerBelt['Laranja e Preta'],
          athletesPerBelt['Verde e Branca'],
          athletesPerBelt['Verde'],
          athletesPerBelt['Verde e Preta'],
        ],
        backgroundColor: [
          'rgb(255, 255, 255, 0.7)',
          'rgb(209, 209, 209, 0.7)',
          'rgb(127, 127, 127, 0.7)',
          'rgb(55, 55, 55, 0.7)',
          'rgb(255, 255, 146, 0.7)',
          'rgb(255, 255, 0, 0.7)',
          'rgb(127, 128, 0, 0.7)',
          'rgb(255, 162, 55, 0.7)',
          'rgb(255, 136, 0, 0.7)',
          'rgb(146, 78, 0, 0.7)',
          'rgb(131, 255, 106, 0.7)',
          'rgb(27, 177, 0, 0.7)',
          'rgb(17, 105, 0, 0.7)',
        ],
        borderColor: [
          'rgb(209, 209, 209)',
          'rgb(209, 209, 209)',
          'rgb(127, 127, 127)',
          'rgb(55, 55, 55)',
          'rgb(255, 255, 146)',
          'rgb(255, 255, 0)',
          'rgb(127, 128, 0)',
          'rgb(255, 162, 55)',
          'rgb(255, 136, 0)',
          'rgb(146, 78, 0)',
          'rgb(131, 255, 106)',
          'rgb(27, 177, 0)',
          'rgb(17, 105, 0)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      plugins={[ChartDataLabels]}
      options={options as any}
    />
  );
}
