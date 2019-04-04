import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Button.css';

const className = require('classnames');

//todo : Add button sizes
export default function({
  children,
  onClick,
  inverted,
  type,
  to,
  }) {
  const buttonStyles = className('radiusButton', { inverted });
  return to ? (
    <Link className="radiusLink" to={to}>
      <button
        type={type}
        onClick={onClick}
        className={buttonStyles}
      >
        {children}
      </button>
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyles}
    >
      {children}
    </button>
  );
}