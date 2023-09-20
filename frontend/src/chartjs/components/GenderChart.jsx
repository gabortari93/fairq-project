import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderChart = ({data}) => {
    const chartData = {
        labels: data.map(gender=>gender.label),
        datasets: [
            {
                data: data.map(gender=>gender.value),
                backgroundColor: [
                    '#4b6bfb',
                    '#67cba0',
                    '#7b92b2',
                ],
                borderWidth: 0,
            },
        ],
    }

    return <Doughnut data={chartData}/>
};

export default GenderChart;
