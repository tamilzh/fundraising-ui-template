import React from 'react'
import heart_icon from '../../assets/images/heart_icon.png'
import wagmi_icon from "../../assets/images/wagmi_icon.png"
import constant from '../../utils/constant'

const Wagmi = () => {
    return (
        <div id='wagmi' className='default-settings'>
            <div className='wagmi__title-box'>
                <img className="wagmi__title-heart-icon" src={heart_icon} alt="catdrop"></img>
                <h1 className="wagmi__title-text plus-sign">+</h1>
                <img className="wagmi__title-nft-icon" src={wagmi_icon} alt="catdrop"></img>
                <h1 className="wagmi__title-text plus-sign">+</h1>
                <h1 className="wagmi__title-text">U</h1>
            </div>
            
      <p className="wagmi__desc">
        {constant.WAGMI_DESC} NFTs are licensed under the
        <a
          href={constant.NFT_LICENSE_LINK}
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit" }}
        >
          {" "}
          {constant.NFT_LICENSE_NAME}
        </a>
      </p>
        </div>
    )
}

export default Wagmi
