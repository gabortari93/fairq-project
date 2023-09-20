import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

// Make sure to register the appropriate components with Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const AgeDistribution = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
          text: 'Date',
        },
      },
      y: {
        display: true,
        title: {
          display: false,
          text: 'Age groups',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AgeDistribution;