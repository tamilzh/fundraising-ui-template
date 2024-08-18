import React from 'react'

const DropdownMenuText = ({menu, onSelect}) => {
    return (
        <ul className='dropdown__lists-text'>
            {menu.map((item) => (
                <li key={item.id} className='dropdown__list' onClick={() => onSelect(item)}>{item.text}</li>
            ))}
        </ul>
    )
}

export default DropdownMenuText