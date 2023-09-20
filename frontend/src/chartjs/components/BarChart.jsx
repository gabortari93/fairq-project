import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

// Make sure to register the appropriate components with Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
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
          text: 'Number of Applicants',
        },
        ticks: {
          stepSize: 1, // ensure only whole numbers are used on the y-axis
          callback: function(value) {
            return value.toString();
          }
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;