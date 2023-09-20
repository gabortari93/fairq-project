import React from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart, ArcElement, PieController, CategoryScale, LinearScale, Title, Tooltip } from "chart.js";

Chart.register(ArcElement, PieController, CategoryScale, LinearScale, Title, Tooltip);

const PieChart = ({ data }) => {
  const options = {
    responsive: true,
  maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top', // You can change the position as needed
        labels: {
          usePointStyle: false, // Change this to false to display box style legends
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;