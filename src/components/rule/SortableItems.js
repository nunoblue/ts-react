import React from 'react';

const SortableItems = (props) => {
    const renderItems = () => {
        if (!props.items) {
            return null;
        }
        return props.items.map((item) => {
            return (
                <li key={item.clazz}>{item.name}</li>
            );
        });
    };

    return (
        <ul>
            {renderItems()}
        </ul>
    );
};

export default SortableItems;
