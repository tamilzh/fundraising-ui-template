import React from 'react'
import chevron_down from '../assets/images/chevron_down.svg'
import DropdownMenuText from './DropdownMenuText'
import DropdownMenuBox from './DropdownMenuBox'

const DropDown = ({ menu, header, bgStyle, styleType, filterType, showBox, showList, onUpdate, onToggle }) => {
  
  return (
    <div className='dropdown__wrapper' onClick={() => onToggle(menu.id)}>
      <div className={`dropdown__top ${menu.selected? 'dropdown__bottom__selected': ''}`}>
        <div className='dropdown-header'>
          <div className={`dropdown__box ${ showBox && (styleType === menu.key && styleType !== 'price') ? 'd-block' : 'd-none'}`} style={bgStyle}></div>
          <span className='dropdown__text'>{header}</span>
        </div>
        <img src={chevron_down} alt='down' className='chevron-down'></img>
      </div>
      <div className={`dropdown__bottom ${filterType === menu.key && showList ? 'd-block' : 'd-none'}`}>
        {menu.menuType === 'text' ? <DropdownMenuText menu={menu.menu} onSelect={(item)=>onUpdate(item, menu)} /> : menu.menuType === 'box' ? <DropdownMenuBox menu={menu.menu} onSelect={(item)=>onUpdate(item, menu)} /> : ''}
      </div>
    </div>
  )
}

export default React.memo(DropDown)