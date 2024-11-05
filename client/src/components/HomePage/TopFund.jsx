/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import topfund_img from "../../assets/images/topfund_img.png";
import Card from "../Card";
import { fundRaisin } from "../../contracts/fundraisin";
import Modal from "../Modal/Modal";
import Popup from "../Modal/Popup";
import PiePopup from "../Modal/PiePopup";
import error from "../../config/error.json";
import { logError, logInfo } from "../../utils/log";
import { useNavigate } from "react-router-dom";
import Error from "../Modal/Error";
import Spinner from "../Spinner";
import Slider from "react-slick";
import SimpleCard from "../SimpleCard";
import constant from "../../utils/constant";

const TopFund = (props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [popUpCard, setPopUpCard] = useState(0);
  const [errShow, setErrShow] = useState(false);
  const [errMessage, setErrorMessage] = useState();
  const [spinner, setSpinner] = useState(false);
  const { siteDetails, connectWallet, isWalletConnected, loading, nftTop } =
    props;
  const slider = siteDetails.sliders;

  const settings = {
    infinite: false,
    speed: 300,
  };

  const openModal = (card) => {
    logInfo("clicked");
    setPopUpCard(card);
    setShow(!show);
  };

  const closeModal = () => {
    setShow(!show);
  };

  const buyNft = async (card) => {
    setSpinner(true);
    const tokenID = card.tokenId;
    const siteTokenIndex = card.siteTokenIndex;
    const price = card.price;
    let status = isWalletConnected;
    if (!isWalletConnected) {
      status = await connectWallet();
    }
    if (status) {
      fundRaisin
        .buyNft(siteDetails.siteId, siteTokenIndex, tokenID, price)
        .then((message) => {
          logInfo(message);
          setTimeout(() => {
            logInfo(message);
            setSpinner(false);
            navigate("/my");
          }, 2000);
        })
        .catch((err) => {
          setSpinner(false);
          let errorMsg = "";
          logError(err);
          if (err) {
            if (err.error) {
              err.data = err.error;
            }
            if (err.data && err.data.message) {
              let customMessage = err.data.message.split(":");
              if (
                customMessage.length > 1 &&
                error[customMessage[1].trim()] !== undefined
              ) {
                errorMsg = `${error[customMessage[1].trim()]
                  .replace("%1", "Catdrop")
                  .replace("%2", "buy")}`;
              } else {
                if ([32000].includes(Math.abs(err.data.code))) {
                  errorMsg = error[Math.abs(err.code)]
                    .replace("%1", "Catdrop")
                    .replace("%2", "buy");
                } else {
                  errorMsg = err.data.message;
                }
              }
            } else if ([4001, 4100].includes(err.code)) {
              errorMsg = error[Math.abs(err.code)]
                .replace("%1", "Catdrop")
                .replace("%2", "buy");
            } else {
              errorMsg = error.UNKNOWN_ERROR;
            }
            openErrorModal(errorMsg);
          }
        });
    } else {
      setSpinner(false);
    }
  };

  const openErrorModal = (err) => {
    setErrorMessage(err);
    setErrShow(!errShow);
  };

  const closeErrorModal = () => {
    setErrShow(!errShow);
  };

  const renderErrorPopup = () => {
    return (
      <Modal show={errShow}>
        <Popup>
          <Error err={errMessage} onClose={closeErrorModal} />
        </Popup>
      </Modal>
    );
  };

  const renderPiePopup = () => {
    return (
      <Modal show={show}>
        <Popup>
          <PiePopup card={popUpCard} sliders={slider} onClose={closeModal} />
        </Popup>
      </Modal>
    );
  };

  const renderCardData = () => {
    //TODO while scroll
    if (loading) {
      return (
        <>
          <div className="card">
            <div className="card-loader card-loader--tabs"></div>
          </div>
          <div className="card">
            <div className="card-loader card-loader--tabs"></div>
          </div>
          <div className="card">
            <div className="card-loader card-loader--tabs"></div>
          </div>
        </>
      );
    } else {
      return (
        <>
          {nftTop.map((card) => (
            <div className="topfund-card-wrapper" key={card.id}>
              <Card
                key={card.id}
                card={card}
                btn={card.owned || !card.forSale ? null : "Buy"}
                download={false}
                onBtnOpen={
                  !card.owned && card.forSale
                    ? () => buyNft(card)
                    : () => logInfo("Not for sale")
                }
                onPieOpen={() => openModal(card)}
              />
            </div>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <span className="link_wrapper" id="top"></span>
      <section id="topfund" className="default-settings gradient-bg">
        <Spinner spinner={spinner} />
        <div className="topfund__title-box">
          <div className="topfund__title-box-group">
            <h1 className="topfund__title-text">Top</h1>
            <img
              className="topfund__title-icon"
              src={topfund_img}
              alt="catdrop"
            ></img>
          </div>
          <h1 className="topfund__title-text">Fundraisers</h1>
        </div>
        <p className="topfund__desc">{constant.TOP_PAGE_DESC}</p>
        <div
          className="topfund-cards"
          style={{
            justifyContent: nftTop.length < 3 ? "center" : "space-between",
          }}
        >
          {renderCardData()}
        </div>
        <div className="topfund-cards-mobile">
          <Slider {...settings}>
            {nftTop.map((card) => (
              <SimpleCard
                key={card.id}
                simpleCard={card}
              />
            ))}
          </Slider>
        </div>
        {renderPiePopup()}
        {renderErrorPopup()}
      </section>
    </>
  );
};

export default TopFund;
