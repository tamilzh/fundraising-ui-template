import React from "react";
import download_icon from "../../assets/images/download_icon.svg";
import twitter from "../../assets/images/twitter.svg";
import constant from "../../utils/constant";

const ShareModal = ({ card, onDownload, onClose }) => {
  const imageUrl = card?.imagepng.split(".net/");
  const link = `${process.env.REACT_APP_WEBSITE_LINK}/share?image=${imageUrl[1]}%26tokenId=${card.tokenId}`;
  const whatUserDid =
    card.numberOfTransfers === 0
      ? "minted"
      : card.numberOfTransfers > 0 && card.forSale
      ? "placed for sale"
      : "bought";
  const showTwitter = () => {
    const tweet = {
      text: `I just ${whatUserDid} a Fund Raisin %23NFT "${card.name.replace(
        "#",
        "%23"
      )}" from the ${process.env.REACT_APP_WEBSITE_NAME} to help raise money for @${process.env.REACT_APP_WEBSITE_BENEFICIARY}.`,
      url: link,
      hashtags: `AwardNFTs,Avalanche`,
    };
    const twitterLink = `${constant.TWITTER_API}url=%0A${tweet.url}%0A&text=${tweet.text}%0A&hashtags=${tweet.hashtags}`;
    if (imageUrl[1]) {
      return (
        <a href={twitterLink} target="_blank" rel="noreferrer">
          <div className="nft__twitter-btn">
            <img className="nft__twitter-icon" src={twitter} alt="twitter" />
          </div>
        </a>
      );
    }
  };
  return (
    <div className="share-modal">
      <div className="close-btn__wrapper" onClick={onClose}>
        <div className="close-btn__bar bar1"></div>
        <div className="close-btn__bar bar2"></div>
      </div>
      <div className="share-icons">
        <div className="nft__download-btn" onClick={() => onDownload(card)}>
          <img
            className="nft__download-icon"
            src={download_icon}
            alt="download"
          />
        </div>
        {showTwitter()}
      </div>
    </div>
  );
};

export default ShareModal;
