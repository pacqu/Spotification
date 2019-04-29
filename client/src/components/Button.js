import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Button.css';

const classNames = require('classnames');

//todo : Add button sizes
export default function({
  className,
  children,
  onClick,
  inverted,
  type,
  to,
  }) {
  const buttonStyles = classNames('radiusButton', className, { inverted });
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