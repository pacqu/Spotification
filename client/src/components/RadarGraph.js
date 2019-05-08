import React from 'react'
import { Radar } from 'react-chartjs-2';

export default function HorizontalBarGraph({ labels, barData1, label1, barData2, label2 }) {
  const definitions = {
    acousticness: `A confidence measure from 0.0 to 1.0 of whether the track is acoustic.
    1.0 represents high confidence the track is acoustic. The distribution of values for this
    feature look like this`,
    danceability: `Danceability describes how suitable a track is for dancing based on a
    combination of musical elements including tempo, rhythm stability, beat strength, and
    overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable. The
    distribution of values for this feature look like this`,
    energy: `Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity
    and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal
    has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing
    to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.
    The distribution of values for this feature look like this`,
    liveness: `Detects the presence of an audience in the recording. Higher liveness values represent
    an increased probability that the track was performed live. A value above 0.8 provides strong likelihood
    that the track is live. The distribution of values for this feature look like this`,
    valence: `A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track.Tracks with
    high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more
    negative (e.g. sad, depressed, angry). The distribution of values for this feature look like this`
  }
  const options = {
    tooltips: {
      // mode: "index",
      callbacks: {
        title: function(tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        afterBody: function(tooltipItem, data) {
          let { index } = tooltipItem[0];
          if ( index === 0) return definitions['acousticness']
          else if ( index === 1 ) return definitions['danceability']
          else if ( index === 2 ) return definitions['energy']
          else if ( index === 3 ) return definitions['liveness']
          else if ( index === 4) return definitions['valence']
          else return ('error')
        }
      },
      intersect: false
    },
    hover: {
      mode: "index",
      intersect: false
    },
    scales: {
      pointLabels: {
        fontColor: 'white'
      },
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
        backgroundColor: 'rgba(179,181,198,0.2)',
        pointLabelFontColor: 'white',
	      borderColor: 'rgba(179,181,198,1)',
	      pointBackgroundColor: 'rgba(179,181,198,1)',
	      pointBorderColor: '#fff',
	      pointHoverBackgroundColor: '#fff',
	      pointHoverBorderColor: 'rgba(179,181,198,1)',
	      data: barData1
      },
      {
        label: label2,
        backgroundColor: 'rgba(89, 171, 227, 0.2)',
        pointLabelFontColor: 'white',
	      borderColor: 'rgba(89, 171, 227, 1)',
	      pointBackgroundColor: 'rgba(89, 171, 227, 1)',
	      pointBorderColor: '#fff',
	      pointHoverBackgroundColor: '#fff',
	      pointHoverBorderColor: 'rgba(89, 171, 227,1)',
	      data: barData2
      }
    ]
  }
  return (
    <Radar data={data} options={options}/>
  )
}
