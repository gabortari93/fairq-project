import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from "chart.js";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const LineChart = ({ data, options }) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
        labels: {
          usePointStyle: false,
        },
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

  return <Line data={data} options={options || defaultOptions} />;
};

export default LineChart;
