
import React from 'react';
import '../styles/Input.css';

const classNames = require('classnames');

export default React.forwardRef((props, ref) => {
  const inputClass = classNames({
    defaultInput: true,
    fullWidth: props.fullWidth ? props.fullWidth : false,
    search: props.search ? props.search : false
  });
  return (
    <input
      ref={ref}
      className={inputClass}
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
    >
      {props.children}
    </input>
  );
});