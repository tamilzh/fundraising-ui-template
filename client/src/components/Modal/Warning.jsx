import React from 'react'

const Warning = ({confirmAction, onClose, sellerDistribution}) => {
  return (
    <div className='mint-warning'>
        <h1 className='mint-warning-msg'>Fund Raisin #AwardNFTs are different! They are for fundraising for a project or a cause. You get to choose how funds are distributed. You have chosen that <strong>you and future sellers will receive {sellerDistribution}%</strong> of the sale proceeds. Please confirm that this is what you really want.</h1>
        <div className='mint-warning-btns'>
            <button className='mint-warning-btn' onClick={confirmAction}>Yes</button>
            <button className='mint-warning-btn' onClick={onClose}>No</button>
        </div>
    </div>
  )
}

export default Warning