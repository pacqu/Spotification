import React from 'react'
import '../styles/Chart.css';
import classNames from 'classnames';

function Chart({ title, children, className }) {
  const chartStyles = classNames('Chart', className);
  return (
    <div className={chartStyles}>
      <div className="ChartTitle">
        { title }
      </div>
      <div className="ChartBody">
        { children }
      </div>
    </div>
  )
}

export default Chart
