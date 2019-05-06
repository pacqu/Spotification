import React from 'react'
import { HorizontalBar } from 'react-chartjs-2';

export default function HorizontalBarGraph({ title, barData, label }) {
  const data = {
    labels: barData.map(m => m[0]),
    datasets: [
      {
        label,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: barData.map(m => m[1])
      }
    ]
  }
  return (
    <HorizontalBar data={data} />
  )
}
