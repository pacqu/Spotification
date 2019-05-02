import React from 'react'
import classNames from 'classnames';
import '../styles/DarkCard.css';

function DarkCard({ size, title, children }) {
  const darkStyles = classNames('dark-card');
  return (
    <div className={darkStyles}>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

export default DarkCard
