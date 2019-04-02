import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Button.css';

const classname = require('classnames');

//todo : Add button sizes
export default function({ children, to, onClick, insideOut }) {
  return to ? (
    <Link className="radiusLink" to={to}>
      <a onClick={onClick} className="radiusButton"> {children} </a>
    </Link>
  ) : (
    <a onClick={onClick} className="radiusButton"> {children} </a>
  );
}