import React from 'react'

const DropdownMenuBox = ({menu, onSelect}) => {
    return (
        <div className='dropdown__lists-grid'>
            {menu.map((item) => (
                <div key={item.id} className={`dropdown__list-grid-item-wrapper ${item.selected ? 'dropdown__list-grid-item--selected' : ''}`}>
                    <div className='dropdown__list-grid-item' style={item.style} onClick={() => onSelect(item)}></div>
                </div>
            ))}
        </div>
    )
}

export default DropdownMenuBox