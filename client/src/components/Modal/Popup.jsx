import React from 'react';

const Popup = ({ children, type }) => {
    const popupClass = type === "warn" ? "warn-popup" : "popup";
    return (
        <div className={popupClass}>
            {children}
        </div>
    )
};

export default Popup;
