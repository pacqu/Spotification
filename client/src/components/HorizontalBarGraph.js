import React from 'react'
import { HorizontalBar } from 'react-chartjs-2';

export default function HorizontalBarGraph({ labels, barData1, label1, barData2, label2 }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: label1,
        backgroundColor: 'rgba(38, 166, 91, 0.3)',
        borderColor: 'rgba(38, 166, 91, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(38, 166, 91,0.4)',
        hoverBorderColor: 'rgba(38, 166, 91, 1)',
        data: barData1
      },
      {
        label: label2,
        backgroundColor: 'rgba(245, 230, 83,0.3)',
        borderColor: 'rgba(245, 230, 83, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(245, 230, 83, 0.4)',
        hoverBorderColor: 'rgba(245, 230, 83, 1)',
        data: barData2
      }
    ]
  }
  return (
    <HorizontalBar data={data} />
  )
}
