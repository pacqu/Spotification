import React from 'react'
import { Radar } from 'react-chartjs-2';

export default function HorizontalBarGraph({ labels, barData1, label1, barData2, label2 }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: label1,
	      backgroundColor: 'rgba(179,181,198,0.2)',
	      borderColor: 'rgba(179,181,198,1)',
	      pointBackgroundColor: 'rgba(179,181,198,1)',
	      pointBorderColor: '#fff',
	      pointHoverBackgroundColor: '#fff',
	      pointHoverBorderColor: 'rgba(179,181,198,1)',
	      data: barData1
      },
      {
        label: label2,
	      backgroundColor: 'rgba(255,99,132,0.2)',
	      borderColor: 'rgba(255,99,132,1)',
	      pointBackgroundColor: 'rgba(255,99,132,1)',
	      pointBorderColor: '#fff',
	      pointHoverBackgroundColor: '#fff',
	      pointHoverBorderColor: 'rgba(255,99,132,1)',
	      data: barData2
      }
    ]
  }
  return (
    <Radar data={data} />
  )
}
