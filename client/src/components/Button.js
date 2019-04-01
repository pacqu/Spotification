import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Button.css';

//todo : Add button sizes
export default function({ children, to }) {
  return to ? (
    <Link className="radiusLink" to={to}>
      <a className="radiusButton"> {children} </a>
    </Link>
  ) : (
    <a className="radiusButton"> {children} </a>
  );
}