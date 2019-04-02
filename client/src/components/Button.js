import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Button.css';

//todo : Add button sizes
export default function({ children, to, onClick }) {
  return to ? (
    <Link className="radiusLink" to={to}>
      <a onClick={onClick} className="radiusButton"> {children} </a>
    </Link>
  ) : (
    <a onClick={onClick} className="radiusButton"> {children} </a>
  );
}