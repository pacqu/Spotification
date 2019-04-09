import React from 'react'
import { Bar } from 'react-chartjs-2';

export default function DoubleBarGraph({ labels, barData1, label1, barData2, label2}) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: label1,
        backgroundColor: 'rgba(255,99,132,0.3)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: barData1
      },
      {
        label: label2,
        backgroundColor: 'rgba(140, 20, 252, 0.3)',
        borderColor: 'rgba(140, 20, 252, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: barData2
      }
    ]
  }

  return (
    <Bar data={data} />
  )
}
