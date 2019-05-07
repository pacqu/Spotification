import React from 'react'
import { Bar } from 'react-chartjs-2';

export default function DoubleBarGraph({ labels, barData1, label1, barData2, label2 }) {
  const definitions = {
    popularity: "Popularity of the song",
    key: `The estimated overall key of the track. Integers map to pitches using standard Pitch Class notation.
    E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.`,
    time_signature: `An estimated overall time signature of a track. The time signature (meter) is a notational
    convention to specify how many beats are in each bar (or measure).`,
    loudness: `The overall loudness of a track in decibels (dB). Loudness values are averaged across
    the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality
    of a sound that is the primary psychological correlate of physical strength (amplitude).
    Values typical range between -60 and 0 db. `,
    tempo: `The overall estimated tempo of a track in beats per minute (BPM). In musical terminology,
    tempo is the speed or pace of a given piece and derives directly from the average beat duration.`
  }
  const options = {
    tooltips: {
      // mode: "index",
      callbacks: {
        title: function(tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        afterBody: function(tooltipItem, data) {
          return definitions[tooltipItem[0].label]
        }
      },
      intersect: false
    },
    hover: {
      mode: "index",
      intersect: false
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "white"
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            fontColor: "white"
          }
        }
      ]
    },
    legend: {
      labels: {
        fontColor: "white"
      }
    }
  };
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
        hoverBackgroundColor: 'rgba(140, 20, 252, 0.4)',
        hoverBorderColor: 'rgba(140, 20, 252, 1)',
        data: barData2
      }
    ]
  }

  return (
    <Bar data={data} options={options} />
  )
}
