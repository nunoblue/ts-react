import React from 'react';

const CommonLabel = (props) => {
    const component = typeof props.visible === 'undefined' || props.visible ? (
        <label htmlFor={props.for} className={props.className}>
            {props.content}
            {props.children}
        </label>
    ) : null;
    return component;
};

export default CommonLabel;
