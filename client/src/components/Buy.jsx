import React, { useState, useEffect, useLayoutEffect } from "react";
import Card from "./Card";
import DropDown from "./DropDown";
import arrow_down from "../assets/images/arrow_down.svg";
import arrow_up from "../assets/images/arrow_up.svg";
import Modal from "./Modal/Modal";
import Popup from "./Modal/Popup";
import PiePopup from "./Modal/PiePopup";
import Error from "./Modal/Error";
import { fundRaisin } from "../contracts/fundraisin";
import constant from "../utils/constant";
import { getBuyFilters, getBuySort } from "../utils/common";
import error from "../config/error.json";
import { logError, logInfo } from "../utils/log";
import Spinner from "./Spinner";
import { useNavigate, useOutletContext } from "react-router-dom";
import Loader from "./Loader";
import Pagination from "../components/Pagination";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const Buy = () => {
  const [
    siteDetails,
    walletAddress,
    connectWallet,
    isWalletConnected,
    ,
    ,
    ,
    ,
    ,
    ,
    forceUpdate,
    buyNftData,
    buyLoading,
    filterData,
  ] = useOutletContext();
  const { tokenId } = useParams();
  const loading = buyLoading;
  const navigate = useNavigate();
  const filter = getBuyFilters(
    constant.priceFilter,
    filterData.artistBackground,
    filterData.pattern
  );
  const sort = getBuySort();
  //filter & sort state variables
  const [priceHeader, setPriceHeader] = useState("Price");
  const [isListOpen, setList] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(undefined);
  const [style, setStyle] = useState();
  const [styleType, setStyleType] = useState();
  const [filterType, setFilterType] = useState();
  const [boxDisplay, setBoxDisplay] = useState(false);
  const [owner, setOwner] = useState("");
  const [isInputOpen, setInputOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(1);
  //cards state variable
  const [nftData, setNftData] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [errShow, setErrShow] = useState(false);
  const [errMessage, setErrorMessage] = useState();
  const [spinner, setSpinner] = useState(false);
  const [popUpCard, setPopUpCard] = useState(0);
  const slider = siteDetails.sliders;

  useEffect(() => {
    const getNftData = async () => {
      setFilteredCards([]);
      setNftData([]);
      try {
        if (tokenId) {
          const nft = [
            ...buyNftData.filter(
              (card) => Number(card.tokenId) === Number(tokenId)
            ),
            ...buyNftData.filter(
              (card) =>
                Number(card.tokenId) !== Number(tokenId) &&
                card.forSale &&
                walletAddress !== card.currentOwner
            ),
            ...buyNftData.filter(
              (card) =>
                Number(card.tokenId) !== Number(tokenId) &&
                !card.forSale &&
                walletAddress !== card.currentOwner
            ),
            ...buyNftData.filter(
              (card) =>
                Number(card.tokenId) !== Number(tokenId) &&
                card.forSale &&
                walletAddress === card.currentOwner
            ),
            ...buyNftData.filter(
              (card) =>
                Number(card.tokenId) !== Number(tokenId) &&
                !card.forSale &&
                walletAddress === card.currentOwner
            ),
          ];
          setNftData(nft);
          setFilteredCards(nft);
        } else {
          const nft = [
            ...buyNftData.filter(
              (card) => card.forSale && walletAddress !== card.currentOwner
            ),
            ...buyNftData.filter(
              (card) => !card.forSale && walletAddress !== card.currentOwner
            ),
            ...buyNftData.filter(
              (card) => card.forSale && walletAddress === card.currentOwner
            ),
            ...buyNftData.filter(
              (card) => !card.forSale && walletAddress === card.currentOwner
            ),
          ];
          setNftData(nft);
          setFilteredCards(nft);
        }
      } catch (err) {
        logError(err);
      }
    };    
    resetfilters()
    getNftData();
    return () => {
      setNftData([]);
      setFilteredCards([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyNftData]);

  const toggleList = (id) => {
    setFilterType(filter[id].key);
    setList(!isListOpen);
    setSelectedMenu(id);
    setInputOpen(false);
  };

  useEffect(() => {
    setList(true);
  }, [selectedMenu]);

  useEffect(() => {
    setPage(1);
  }, [walletAddress]);

  const paginationData = useMemo(() => {
    const filtered = filteredCards; /*.filter((card) => {
      return card.currentOwner !== walletAddress;
    });*/
    const firstPageIndex = (currentPage - 1) * constant.CARDS_PER_PAGE;
    const lastPageIndex = firstPageIndex + constant.CARDS_PER_PAGE;
    logInfo(
      filteredCards.length,
      firstPageIndex,
      lastPageIndex,
      filtered,
      filtered.slice(firstPageIndex, lastPageIndex)
    );
    return filtered.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredCards]);

  // Filter Dropdown options
  const filterDropdown = (item, menu) => {
    setSelectedShow(0);
    let fCards = [];
    switch (menu.key) {
      case "price":
        setPriceHeader(item.text);
        let priceString = item.text.split(" ");
        if (priceString[0] === "<") {
          fCards = nftData.filter(
            (card) => card.price < Number(priceString[1])
          );
        } else if (priceString[0] === ">") {
          fCards = nftData.filter(
            (card) => card.price > Number(priceString[1])
          );
        } else if (priceString[1] === "-") {
          fCards = nftData.filter(
            (card) =>
              card.price >= Number(priceString[0]) &&
              card.price <= Number(priceString[2])
          );
        }
        break;
      case "bgcolor":
        setPriceHeader("Price");
        setBoxDisplay(true);
        setStyle(item.style);
        let bgcolor = item.style.backgroundColor;
        fCards = nftData.filter((card) => card.bgColor === bgcolor);
        break;
      case "pattern":
        setPriceHeader("Price");
        setBoxDisplay(true);
        setStyle(item.style);
        let pattern = item.name;
        fCards = nftData.filter((card) => card.pattern === pattern);
        break;
      default:
    }
    setStyleType(item.key);
    updateSelectedFilter(menu.id);
    setFilteredCards([...fCards]);
    setPage(1);
  };

  // Filter Owners
  const filterOwner = (value) => {
    let trimmedValue = value.trim();
    setPriceHeader("Price");
    setBoxDisplay(false);
    setOwner(trimmedValue);
    let fCards = nftData.filter((card) => card.address.includes(trimmedValue));
    setFilteredCards([...fCards]);
  };

  const toggleInput = (id) => {
    setInputOpen(!isInputOpen);
    updateSelectedFilter(id);
    setList(false);
  };

  const resetfilters = () => {
    setPriceHeader("Price");
    setList(false);
    setBoxDisplay(false);
    setSelectedShow(1);
    setPage(1);
  }
  // Show all the nfts
  const filterViewAll = (id) => {
    resetfilters()    
    updateSelectedFilter(id);
    setFilteredCards(nftData);
  };

  // Show all the nfts
  const filterMine = () => {
    resetfilters()
    setSelectedShow(2);
    const fCards = nftData.filter(
      (card) => card.currentOwner === walletAddress
    );
    setFilteredCards(fCards);
  };

  // Show all the nfts
  const filterForSale = () => {
    resetfilters()
    setSelectedShow(3);
    const fCards = nftData.filter((card) => card.forSale);
    setFilteredCards(fCards);
  };

  // Show all the nfts
  const filterNotForSale = () => {
    resetfilters()
    setSelectedShow(4);
    const fCards = nftData.filter((card) => !card.forSale);
    setFilteredCards(fCards);
  };

  // Update the selected button in filters
  const updateSelectedFilter = (id) => {
    let filterData = filter;
    filterData.map((i) => (i.selected = false));
    if (filterData[id]) filterData[id].selected = true;
  };

  // Update sort
  const sortFilter = (item) => {
    let fCards = [];
    if (item.sortType === "price") {
      if (item.direction === "up") {
        fCards = filteredCards.sort((a, b) => a.price - b.price);
      } else {
        fCards = filteredCards.sort((a, b) => b.price - a.price);
      }
    }
    if (item.sortType === "tnc") {
      if (item.direction === "up") {
        fCards = filteredCards.sort(
          (a, b) => a.pieData[2].value - b.pieData[2].value
        );
      } else {
        fCards = filteredCards.sort(
          (a, b) => b.pieData[2].value - a.pieData[2].value
        );
      }
    }
    sort.map((i) => (i.selected = false));
    sort[item.id].selected = true;
    setFilteredCards([...fCards]);
  };

  const openModal = (card) => {
    setPopUpCard(card);
    setShow(!show);
  };

  const openErrorModal = (err) => {
    setErrorMessage(err);
    setErrShow(!errShow);
  };

  const closeErrorModal = () => {
    setErrShow(!errShow);
  };

  const closeModal = () => {
    setShow(!show);
  };

  const buyNft = async (card) => {
    setSpinner(true);
    const tokenID = card.tokenId;
    const siteTokenIndex = card.siteTokenIndex;
    const price = card.price.toString();
    let status = isWalletConnected;
    if (!isWalletConnected) {
      status = await connectWallet();
    }
    if (status) {
      await fundRaisin
        .buyNft(siteDetails.siteId, siteTokenIndex, tokenID, price)
        .then((message) => {
          forceUpdate();
          setTimeout(() => {
            logInfo(message);
            setSpinner(false);
            navigate("/my");
          }, 2000);
        })
        .catch((err) => {
          let errorMsg = "";
          logError(err);
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

  const renderPiePopup = () => {
    return (
      <Modal show={show}>
        <Popup>
          <PiePopup card={popUpCard} sliders={slider} onClose={closeModal} />
        </Popup>
      </Modal>
    );
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

  useLayoutEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  });

  const renderCardData = () => {
    //TODO while scroll
    if (paginationData.length === 0 && !loading)
      return <h3 className="sort__text">No item to display</h3>;
    return (
      <>
        {paginationData.map((card) => (
          <div
            className="nft-grid-card__wrapper"
            key={card.id}
            data-id={card.id}
          >
            <Card
              card={card}
              btn={
                card.forSale && walletAddress !== card.currentOwner
                  ? "Buy"
                  : null
              }
              download={false}
              overlay={false}
              overlayText={false}
              onBtnOpen={() => buyNft(card)}
              onPieOpen={() => openModal(card)}
              isOwner={walletAddress === card.currentOwner}
            />
          </div>
        ))}
      </>
    );
  };
  return (
    <section id="buy" className="page-settings">
      <Spinner spinner={spinner} />
      <h1 className="page-title title-styles">{constant.ART_NAME} for Sale</h1>
      <div className="filter-group">
        {/*
        <div className="filter">
          <h3 className="filter__text">Show</h3>
          <div className="filter-grid">
            <div className="filter-item-grid">
              <button
                className={`filter__btn ${
                  selectedShow === 1 ? "filter__btn--selected" : ""
                }`}
                onClick={filterViewAll}
              >
                All
              </button>
            </div>
            <div className="filter-item-grid">
              <button
                className={`filter__btn ${
                  selectedShow === 2 ? "filter__btn--selected" : ""
                }`}
                onClick={filterMine}
              >
                {constant.MY_NFT}
              </button>
            </div>
            <div className="filter-item-grid">
              <button
                className={`filter__btn ${
                  selectedShow === 3 ? "filter__btn--selected" : ""
                }`}
                onClick={filterForSale}
              >
                For Sale
              </button>
            </div>
            <div className="filter-item-grid">
              <button
                className={`filter__btn ${
                  selectedShow === 4 ? "filter__btn--selected" : ""
                }`}
                onClick={filterNotForSale}
              >
                Not For Sale
              </button>
            </div>
          </div>
        </div> */}
        <div className="filter">
          <h3 className="filter__text">Filter by</h3>
          <div className="filter-grid">
            {filter.map((item, index) => (
              <div key={index} className="filter-item-grid">
                {item.filterType === "dropdown" ? (
                  <DropDown
                    menu={item}
                    header={item.key === "price" ? priceHeader : item.header}
                    bgStyle={style}
                    styleType={styleType}
                    filterType={filterType}
                    showBox={boxDisplay}
                    showList={isListOpen}
                    onUpdate={filterDropdown}
                    onToggle={toggleList}
                  />
                ) : item.filterType === "textbox" ? (
                  <>
                    <button
                      className={`filter__btn ${
                        item.selected ? "filter__btn--selected" : ""
                      }`}
                      onClick={() => toggleInput(item.id)}
                    >
                      Owner
                    </button>
                    <div
                      className={`owner-input__wrapper ${
                        isInputOpen ? "d-block" : "d-none"
                      }`}
                    >
                      <input
                        name="owner"
                        className="owner-input"
                        value={owner}
                        onInput={(e) => filterOwner(e.target.value)}
                        placeholder="Type address"
                      ></input>
                    </div>
                  </>
                  ) : item.filterType === "button" ? (
                    <button
                      className={`filter__btn ${
                        item.selected ? "filter__btn--selected" : ""
                      }`}
                      onClick={() => filterViewAll(item.id)}
                    >
                      View All
                    </button>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="filter">
          <h3 className="filter__text">Sort by</h3>
          <div className="filter-grid">
            {sort.map((item) => (
              <div key={item.id} className="filter-item-grid">
                <div
                  className={`sort__btn-wrapper ${
                    item.selected ? "sort__btn--selected" : ""
                  }`}
                  onClick={() => sortFilter(item)}
                >
                  <span className="sort__btn-text">{item.header}</span>
                  <img
                    src={item.direction === "up" ? arrow_up : arrow_down}
                    alt="down"
                    className="chevron-down"
                  ></img>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="nft-cards buy-cards"
        style={{ justifyContent: paginationData.length < 4 ? "center" : "" }}
      >
        {renderCardData()}
        {<Loader loading={loading} />}
      </div>

      <Pagination
        currentPage={currentPage}
        totalCount={
          filteredCards /*.filter((card) => {
            return card.currentOwner !== walletAddress;
          })*/.length
        }
        siblingCount={3}
        pageSize={constant.CARDS_PER_PAGE}
        onPageChange={(page) => setPage(page)}
      />
      {renderPiePopup()}
      {renderErrorPopup()}
    </section>
  );
};

export default Buy;
