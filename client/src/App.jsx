/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Template/Header";
import Footer from "./components/Template/Footer";
import { fundRaisin } from "./contracts/fundraisin";
import { ethers } from "ethers";
import error from "./config/error.json";
import Spinner from "./components/Spinner";
import { logError, logInfo } from "./utils/log";
import Modal from "./components/Modal/Modal";
import Popup from "./components/Modal/Popup";
import Error from "./components/Modal/Error";
import { browserName } from "react-device-detect";
import {
  getConstants,
  isApproved,
  getSite,
  getSiteDistribution,
  getTopFundraiser,
  getMyNFT,
  getBuyNFT,
  getFilterData,
  getTotalMinted,
  BASE_API,
  getWebsiteConfig,
} from "./utils/services";
import "./index.css";

const App = () => {
  const [siteDetails, setSiteDetails] = useState({});
  const [walletAddress, setAddress] = useState(0);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [errShow, setErrShow] = useState(false);
  const [errMessage, setErrorMessage] = useState("");
  const [spinner, setSpinner] = useState(true);
  const [nftData, setNftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buyNftData, setBuyNftData] = useState([]);
  const [buyLoading, setBuyLoading] = useState(false);
  const [nftTop, setTopData] = useState([]);
  const [topLoading, setTopLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [newest, setNewest] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [query, setQuery] = useState();
  const [webPrimaryColor, setWebPrimaryColor] = useState("");
  const [webSecondaryColor, setWebSecondaryColor] = useState("");
  const previewFile = false;
  const getNetwork = async () => {
    const response = await fetch(`${BASE_API}/network`);
    const network = await response.json();
    return network;
  };

  const connectWallet = async () => {
    let errorMsg = "";
    try {
      const network = await getNetwork();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      logInfo(`connected network: ${parseInt(window.ethereum.chainId, 16)}`);
      logInfo(`expected network: ${network.chainId}`);
      if (parseInt(network.chainId) !== parseInt(window.ethereum.chainId, 16)) {
        errorMsg = error.NETWORK_NOT_SUPPORTED.replace("%1", network.name);
        openErrorModal(errorMsg);
        return;
      } else {
        await provider.send("eth_requestAccounts", []);
        const wAddress = await provider.getSigner().getAddress();
        const { contract } = await getConstants();
        await fundRaisin.initializeWithSigner(
          contract.fundraisin,
          provider,
          wAddress
        );
        setAddress(wAddress);
        setWalletConnected(true);
        return true;
      }
    } catch (err) {
      logError(err);
      if (!window.ethereum) {
        errorMsg = error.INSTALL_METAMASK;
        openErrorModal(errorMsg);
      }
      return false;
    }
  };

  const updateWalletAddress = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .getSigner()
      .getAddress()
      .then(async (res) => {
        await connectWallet();
      })
      .catch((err) => {
        logError(err);
        setWalletConnected(false);
        setAddress(0);
      });
  };

  const checkBrowser = () => {
    // Brave also returns as chrome
    if (browserName === "Firefox") {
      // if (!["chrome"].includes(browserName.toLowerCase())) {
      let errorMsg =
        "Fund Raisin sites are currently only supported on Chrome and Brave browsers on desktop and in Metamask browser on moblie.";
      openErrorModal(errorMsg);
      return;
      // }
    }
    //openErrorModal(browserName);
  };

  const getBuyFilterData = async (req) => {
    getFilterData(req).then((filterData) => setFilterData(filterData));
  };

  const getContractDetails = async () => {
    let errorMsg = "";
    try {
      const siteActive = await isApproved();
      const siteDetails = await getSite();
      const totalMinted = await getTotalMinted();
      const sliders = await getSiteDistribution(siteDetails);
      await getBuyFilterData(siteDetails);
      setSiteDetails({ ...siteDetails, sliders, ...totalMinted });
      if (!siteActive[0]) {
        if (siteActive[1] !== "SNA") {
          errorMsg = error[siteActive[1]];
          if (errorMsg !== undefined) openErrorModal(errorMsg);
        }
      }
      setSpinner(false);
    } catch (e) {
      logError(e);
      errorMsg = error.CONTRACT_CONNECTION_ERROR;
      openErrorModal(errorMsg);
    }
  };

  const getTopData = async () => {
    try {
      setTopLoading(true);
      let nftList = await getTopFundraiser(walletAddress);
      setTopData(nftList);
      setTopLoading(false);
    } catch (err) {
      logError(err);
      setTopLoading(false);
    }
  };

  const getNftData = async () => {
    if (walletAddress !== 0) {
      try {
        setNftData([]);
        setLoading(true);
        let nft = await getMyNFT(walletAddress);
        setNftData(nft.data);
        setNewest(nft.newest);
        setLoading(false);
      } catch (err) {
        logError(err);
        setLoading(false);
      }
    }
  };

  const getBuyNftData = () => {
    setBuyNftData([]);
    setBuyLoading(true);
    query?.cancel();
    const q = getBuyNFT(walletAddress);
    setQuery(q);
    q.then((nft) => {
      setBuyNftData(nft.data);
      setBuyLoading(false);
    }).catch((err) => {
      logError(err);
      setBuyLoading(false);
    });
  };

  const loadContracts = () => {
    const checkSiteActive = async () => {
      await getContractDetails();
    };
    checkSiteActive();
  };

  const updateSite = async () => {
    const {
      PRIMARY,
      SECONDARY,
      PRIMARY_GREY,
      SECONDARY_GREY,
      GRADIENT_LIGHT,
      GRADIENT_DARK,
      DROPDOWN_HOVER,
      DISABLED_CLOSE,
    } = await getWebsiteConfig();
    const root = document.documentElement;
    root.style.setProperty("--web-primary-color", PRIMARY);
    root.style.setProperty("--web-seconady-color", SECONDARY);
    root.style.setProperty("--primary-grey", PRIMARY_GREY);
    root.style.setProperty("--secondary-grey", SECONDARY_GREY);
    root.style.setProperty("--gradient-color-light", GRADIENT_LIGHT);
    root.style.setProperty("--gradient-color-dark", GRADIENT_DARK);
    root.style.setProperty("--dropdown-hover-color", DROPDOWN_HOVER);
    root.style.setProperty("--disabled-button-color", DISABLED_CLOSE);
    setWebPrimaryColor(PRIMARY);
    setWebSecondaryColor(SECONDARY);
  };

  useEffect(() => {
    updateSite();
  }, []);

  useEffect(() => {
    checkBrowser();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        updateWalletAddress();
      });
      window.ethereum.on("accountsChanged", () => {
        updateWalletAddress();
      });
    }
    loadContracts();
  }, [checkBrowser, loadContracts, updateWalletAddress]);

  useEffect(() => {
    getNftData();
    getTopData();
    getBuyNftData();
    return () => {
      setNftData([]);
      setTopData([]);
      setBuyNftData([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, reload]);

  const openErrorModal = (err) => {
    setSpinner(false);
    setErrorMessage(err);
    setErrShow(!errShow);
  };

  const closeErrorModal = () => {
    setErrShow(!errShow);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getTotalMinted().then((data) => {
        setSiteDetails((site) => ({ ...site, ...data }));
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const forceUpdate = async () => {
    const totalMinted = await getTotalMinted();
    setSiteDetails((site) => ({ ...site, ...totalMinted }));
    setReload(!reload);
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

  return (
    <React.Fragment>
      {renderErrorPopup()}
      {spinner ? (
        <Spinner spinner={spinner} />
      ) : (
        <React.Fragment>
          <Header walletAddress={walletAddress} connectWallet={connectWallet} />
          <div className="template-body">
            <Outlet
              context={[
                siteDetails,
                walletAddress,
                connectWallet,
                isWalletConnected,
                nftData,
                newest,
                nftTop,
                loading,
                topLoading,
                previewFile,
                forceUpdate,
                buyNftData,
                buyLoading,
                filterData,
                webPrimaryColor,
                webSecondaryColor,
              ]}
            />
          </div>
          <Footer
            webPrimaryColor={webPrimaryColor}
            webSecondaryColor={webSecondaryColor}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default App;
