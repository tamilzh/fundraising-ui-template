import React, { useState, useEffect, useLayoutEffect } from "react";
import Card from "./Card";
import Modal from "./Modal/Modal";
import Popup from "./Modal/Popup";
import SalePopup from "./Modal/SalePopup";
import PiePopup from "./Modal/PiePopup";
import { fundRaisin } from "../contracts/fundraisin";
import converter from "number-to-words";
import { logError, logInfo } from "../utils/log";
import Spinner from "./Spinner";
import Loader from "./Loader";
import error from "../config/error.json";
import Error from "./Modal/Error";
import ShareModal from "./Modal/ShareModal";
import Pagination from "../components/Pagination";
import constant from "../utils/constant";
import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";

const MyPage = () => {
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
  const [currentPage, setPage] = useState(1);
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

  const paginationData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * constant.MYCARDS_PER_PAGE;
    const lastPageIndex = firstPageIndex + constant.MYCARDS_PER_PAGE;
    logInfo(
      nftData.length,
      firstPageIndex,
      lastPageIndex,
      nftData,
      nftData.slice(firstPageIndex, lastPageIndex)
    );
    return nftData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, nftData]);

  useEffect(() => {
    setPage(1);
  }, [walletAddress]);

  const downloadImage = (card) => {
    logInfo(card);
    fetch(`/download`, {
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

  useLayoutEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  });

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
    if (paginationData.length === 0 && !loading)
      return <h3 className="sort__text">No item to display</h3>;
    return (
      <>
        {paginationData.map((card) => (
          <div className="nft-grid-card__wrapper" key={card.id}>
            <Card
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
      </>
    );
  };

  const getTitle = () => {
    if (nftData.length) {
      if (nftData.length === 1) {
        return `My One Catdrop`;
      } else {
        return `My ${
          nftData.length > 12
            ? nftData.length
            : converter.toWords(nftData.length)
        } Catdrops`;
      }
    }
    return `My Catdrops`;
  };

  return (
    <section id="mynft-page" className="page-settings">
      <Spinner spinner={spinner} />
      <div className="mynft-page__title-box row">
        <div className="col-12">
          <h1 className="mynft-page__title title-styles">{getTitle()}</h1>
        </div>
      </div>
      {renderSalePopup()}
      <div
        className="nft-cards buy-cards"
        style={{ justifyContent: nftData.length < 4 ? "center" : "" }}
      >
        {renderCardData()}
        {<Loader loading={loading} />}
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={nftData.length}
        pageSize={constant.MYCARDS_PER_PAGE}
        onPageChange={(page) => setPage(page)}
      />
      {renderPiePopup()}
      {renderErrorPopup()}
      {renderSharePopup()}
    </section>
  );
};

export default MyPage;
