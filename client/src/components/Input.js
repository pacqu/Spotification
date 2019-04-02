import React from 'react';
import '../styles/Input.css';

const classNames = require('classnames');

export default function({
    children,
    type,
    placeholder,
    fullWidth
    }) {
    const inputClass = classNames({
        'defaultInput': true,
        'fullWidth': fullWidth ? fullWidth : false
    })
    return (
        <input
            className={inputClass}
            type={type}
            placeholder={placeholder}
        >{children}
        </input>
    )
}