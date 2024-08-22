import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper";
import { NavLink } from "react-router-dom";
import Loader from "../Loader";
import Slider from "react-slick";
import Card from "../Card";
import Modal from "../Modal/Modal";
import Popup from "../Modal/Popup";
import SalePopup from "../Modal/SalePopup";
import PiePopup from "../Modal/PiePopup";
import { fundRaisin } from "../../contracts/fundraisin";
import { logError, logInfo } from "../../utils/log";
import Spinner from "../Spinner";
import error from "../../config/error.json";
import Error from "../Modal/Error";
import ShareModal from "../Modal/ShareModal";
import { useOutletContext } from "react-router-dom";
import { BASE_API } from "../../utils/services";
import { getThemeConfig }from "../../utils/common";

const MyNft = () => {
  //const [nftData, setNftData] = useState(nft);
  //const [loading, setLoading] = useState(false);
  const [
    siteDetails,
    walletAddress,
    connectWallet,
    isWalletConnected,
    nftData,
    newest,
    ,
    loading,
    ,
    ,
    forceUpdate,
  ] = useOutletContext();
  const [saleShow, setSaleShow] = useState(false);
  const [pieShow, setPieShow] = useState(false);
  const [saleStatus, setSaleStatus] = useState("");
  const [card, setCard] = useState({});
  const [priceDist, setPrice] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [errShow, setErrShow] = useState(false);
  const [errMessage, setErrorMessage] = useState();
  const [showShare, setShareShow] = useState(false);
  const [popUpCard, setPopUpCard] = useState(0);
  const slider = siteDetails.sliders;

  const settings = {
    infinite: false,
    speed: 300,
  };

  //Download
  const downloadImage = (card) => {
    logInfo(card);
    fetch(`${BASE_API}/download`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ url: card.image }),
    }).then(function (res) {
      logInfo(res);
      res.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        logInfo(url);
        let a = document.createElement("a");
        a.href = url;
        a.download = card.name + ".png";
        a.click();
      });
    });
  };

  const openSaleModal = (card, btn) => {
    logInfo({ card, btn });
    setCard(card);
    setSaleStatus(btn);
    setSaleShow(!saleShow);
    setPrice(card.originalPrice);
  };

  const closeSaleModal = () => {
    setSaleShow(!saleShow);
  };

  const openErrorModal = (err) => {
    setErrorMessage(err);
    setErrShow(!errShow);
  };

  const closeErrorModal = () => {
    setErrShow(!errShow);
  };

  const openShareModal = (card) => {
    setCard(card);
    setShareShow(!showShare);
  };

  const closeShareModal = () => {
    setShareShow(!showShare);
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

  const openPieModal = (card) => {
    setPopUpCard(card);
    setPieShow(!pieShow);
  };

  const closePieModal = () => {
    setPieShow(!pieShow);
  };

  const renderPiePopup = () => {
    return (
      <Modal show={pieShow}>
        <Popup>
          <PiePopup card={popUpCard} sliders={slider} onClose={closePieModal} />
        </Popup>
      </Modal>
    );
  };

  const cancelSale = async () => {
    setSpinner(true);
    const tokenId = card.tokenId;
    const siteTokenIndex = card.siteTokenIndex;
    const price = card.originalPrice.toString();
    let status = isWalletConnected;
    if (!isWalletConnected) {
      status = await connectWallet();
    }
    if (status) {
      await fundRaisin.changeTokenPrice(
        siteDetails.siteId,
        siteTokenIndex,
        tokenId,
        price,
        false
      );
      setSpinner(false);
      setSaleShow(!saleShow);
      forceUpdate();
    } else {
      setSpinner(false);
    }
  };

  const placeSale = async () => {
    setSpinner(true);
    const tokenId = card.tokenId;
    const siteTokenIndex = card.siteTokenIndex;
    const price = priceDist.toString();
    let status = isWalletConnected;
    if (!isWalletConnected) {
      status = await connectWallet();
    }
    if (status) {
      fundRaisin
        .changeTokenPrice(
          siteDetails.siteId,
          siteTokenIndex,
          tokenId,
          price,
          true
        )
        .then((message) => {
          setSpinner(false);
          setSaleShow(!saleShow);
          forceUpdate();
        })
        .catch((err) => {
          logError(err);
          let errorMsg = "";
          if (err) {
            setSpinner(false);
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
                  .replace("%2", "sell")}`;
              } else {
                if ([32000].includes(Math.abs(err.data.code))) {
                  errorMsg = error[Math.abs(err.code)]
                    .replace("%1", "Catdrop")
                    .replace("%2", "sell");
                } else {
                  errorMsg = err.data.message;
                }
              }
            } else if ([4001, 4100].includes(err.code)) {
              errorMsg = error[Math.abs(err.code)]
                .replace("%1", "Catdrop")
                .replace("%2", "sell");
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

  const changeDist = (value) => {
    setPrice(value);
  };

  const renderSalePopup = () => {
    if (Object.keys(card).length > 0) {
      return (
        <Modal show={saleShow}>
          <Popup>
            <SalePopup
              sliders={siteDetails.sliders}
              card={card}
              show={saleShow}
              saleStatus={saleStatus}
              onClose={closeSaleModal}
              onCancel={cancelSale}
              onSale={placeSale}
              onChangePrice={changeDist}
            />
          </Popup>
        </Modal>
      );
    }
  };

  const renderSharePopup = () => {
    if (Object.keys(card).length > 0) {
      return (
        <Modal show={showShare}>
          <Popup>
            <ShareModal
              card={card}
              onDownload={downloadImage}
              onClose={closeShareModal}
            />
          </Popup>
        </Modal>
      );
    }
  };

  const renderCardData = () => {
    //need to add the lenght of nftData
    if (walletAddress) {
      if (loading) {
        return (
          <div className="nft-cards">
            <Loader loading={loading} />
          </div>
        );
      } else {
        if (nftData.length === 0)
          return (
            <h1 className="no-nft-text">
              <NavLink to="/buy">Buy</NavLink> or{" "}
              <NavLink to="/mint">mint</NavLink> your first {getThemeConfig().APP_NFT_NAME}!
            </h1>
          );
        else if (nftData.length <= 3) {
          return (
            <>
              <div className="my-nfts" style={{ justifyContent: "center" }}>
                {/* {nftData.map((simpleCard) => (
                  <div
                    className="nft-grid-simplecard__wrapper"
                    key={simpleCard.id}
                  >
                    <SimpleCard
                      key={simpleCard.id}
                      simpleCard={simpleCard}
                      overlayText={simpleCard.forSale}
                    />
                  </div>
                ))} */}
                {nftData.map((card) => (
                  <div className="nft-grid-simplecard__wrapper" key={card.id}>
                    <Card
                      key={card.id}
                      card={card}
                      btn={card.forSale ? "Cancel Sale" : "Sell"}
                      show={saleShow}
                      download={true}
                      overlay={false}
                      overlayText={card.forSale}
                      newest={newest}
                      onBtnOpen={openSaleModal}
                      onPieOpen={() => openPieModal(card)}
                      onShare={() => openShareModal(card)}
                    />
                  </div>
                ))}
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="mynft__swipper">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={50}
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  <div className="swiper-wrapper swiper-wrap">
                    {/* {nftData.map((simpleCard) => (
                      <div key={simpleCard.id} className="swiper-slide">
                        <SimpleCard
                          key={simpleCard.id}
                          simpleCard={simpleCard}
                          overlayText={simpleCard.forSale}
                        />
                      </div>
                    ))} */}
                    {nftData.map((card) => (
                      <div key={card.id} className="swiper-slide">
                        <Card
                          key={card.id}
                          card={card}
                          btn={card.forSale ? "Cancel Sale" : "Sell"}
                          show={saleShow}
                          download={true}
                          overlay={false}
                          overlayText={card.forSale}
                          newest={newest}
                          onBtnOpen={openSaleModal}
                          onPieOpen={() => openPieModal(card)}
                          onShare={() => openShareModal(card)}
                        />
                      </div>
                    ))}
                  </div>
                </Swiper>
              </div>
            </>
          );
        }
      }
    } else {
      return (
        <h1 className="no-nft-text">
          <NavLink to="/buy" className="link-design">
            Buy
          </NavLink>{" "}
          or{" "}
          <NavLink to="/mint" className="link-design">
            mint
          </NavLink>{" "}
          your first {getThemeConfig().APP_NFT_NAME}!
        </h1>
      );
    }
  };

  const renderMobileCardData = () => {
    //need to add the lenght of nftData
    if (walletAddress) {
      if (loading) {
        return (
          <div className="nft-cards">
            <Loader loading={loading} />
          </div>
        );
      } else {
        if (nftData.length === 0)
          return (
            <h1 className="no-nft-text">
              <NavLink to="/buy">Buy</NavLink> or{" "}
              <NavLink to="/mint">mint</NavLink> your first {getThemeConfig().APP_NFT_NAME}!
            </h1>
          );
        else {
          return (
            <Slider {...settings}>
              {nftData.map((card) => (
                // <SimpleCard
                //   key={card.id}
                //   simpleCard={card}
                //   overlayText={card.forSale}
                // />
                <Card
                  key={card.id}
                  card={card}
                  btn={card.forSale ? "Cancel Sale" : "Sell"}
                  show={saleShow}
                  download={true}
                  overlay={false}
                  overlayText={card.forSale}
                  newest={newest}
                  onBtnOpen={openSaleModal}
                  onPieOpen={() => openPieModal(card)}
                  onShare={() => openShareModal(card)}
                />
              ))}
            </Slider>
          );
        }
      }
    } else {
      return (
        <h1 className="no-nft-text">
          <NavLink to="/buy" className="link-design">
            Buy
          </NavLink>{" "}
          or{" "}
          <NavLink to="/mint" className="link-design">
            mint
          </NavLink>{" "}
          your first {getThemeConfig().APP_NFT_NAME}!
        </h1>
      );
    }
  };

  return (
    <>
      <span className="link_wrapper" id="my"></span>
      <section className="default-settings">
        <div className="mynft__title-box">
          <div className="mynft__title-column column1"></div>
          <div className="mynft__title-column column2">
            <h1 className="mynft__title">My {getThemeConfig().APP_NFT_PLURAL}</h1>
          </div>
          <div className="mynft__title-column column3">
            {nftData.length !== 0 ? (
              <NavLink to="/my">
                <h3 className="mynft__viewall">View More</h3>
              </NavLink>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mynft-cards">{renderCardData()}</div>
        <div className="mynft-cards-mobile">{renderMobileCardData()}</div>
        <Spinner spinner={spinner} />
        {renderSalePopup()}
        {renderPiePopup()}
        {renderErrorPopup()}
        {renderSharePopup()}
      </section>
    </>
  );
};

export default MyNft;
