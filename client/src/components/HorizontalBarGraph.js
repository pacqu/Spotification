import React from 'react'
import { HorizontalBar } from 'react-chartjs-2';

export default function HorizontalBarGraph({ labels, barData1, label1, barData2, label2 }) {
  const definitions = {
    instrumentalness: `Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are
    treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The
    closer the instrumentalness value is to 1.0, the greater likelihood the track contains no
    vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence
    is higher as the value approaches 1.0.`,
    speechiness: `Speechiness detects the presence of spoken words in a track. The more exclusively
    speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute
    value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values
    between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections
    or layered, including such cases as rap music. Values below 0.33 most likely represent music and
    other non-speech-like tracks.`
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
    <HorizontalBar data={data} options={options}/>
  )
}
