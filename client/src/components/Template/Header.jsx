import React, { useEffect, useState } from "react";
import catdrop_blue from "../../assets/images/catdrop_blue.png";
import catdrop_ltblue from "../../assets/images/catdrop_ltblue.png";
import catdrop_red from "../../assets/images/catdrop_red.png";
import catdrop_coral from "../../assets/images/catdrop_coral.png";
import logo from "../../assets/images/logo.svg";
import { HashLink as Link } from "react-router-hash-link";
import { NavLink } from "react-router-dom";
import { logInfo } from "../../utils/log";
import wallet from "../../assets/images/wallet.svg";
import mobile_wallet from "../../assets/images/mobile_wallet.svg";
import ham from "../../assets/images/ham_burger.svg";
import { isAndroid, isIOS } from "react-device-detect";
import AVVY from "@avvy/client";
import { ethers } from "ethers";
import { getConstants } from "../../utils/services";

const Header = ({ walletAddress, connectWallet }) => {
  const [walletAdr, setWalletAdr] = useState(walletAddress);
  const [currentPath, setCurrentPath] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  let classname = ""

  switch(currentPath){
    case 'mint':
      classname = "active";
      break;
    case 'buy':
      classname = "active";
      break;
    case 'faqs':
      classname = "active";
      break;
    default:
      classname = "";
  }

  const handleWalletClick = () => {
    if (!walletAddress) {
      if (isAndroid || isIOS) {
        if (!window.ethereum) {
          const fallbackToStore = function () {
            window.location.replace(`https://metamask.app.link/`);
          };
          window.location.replace(
            `dapp://${process.env.REACT_APP_WEBSITE_LINK.substring(8)}/`
          );
          setTimeout(fallbackToStore, 700);
        }
      }
      connectWallet();
    }
  };
  useEffect(() => {
    const checkWallet = () => {
      logInfo("checking wallet");
      if (window.ethereum && window.ethereum.selectedAddress !== null) {
        connectWallet();
      }
    };
    checkWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkAddress = async () => {
      if (walletAddress) {
        const trunc_address = ` ${walletAddress.slice(
          0,
          6
        )}...${walletAddress.slice(walletAddress.length - 4)} `;
        const { NETWORK_URL } = await getConstants();
        const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
        const avvy = new AVVY(provider);
        const hash = await avvy.reverse(AVVY.RECORDS.EVM, walletAddress);
        if (hash != null) {
          const name = await hash.lookup();
          setWalletAdr(name.name);
        } else {
          setWalletAdr(trunc_address);
        }
      }
    };
    checkAddress();
  }, [walletAddress]);

  const changeBgOnScroll = () => {
    if (window.scrollY >= 66) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  useEffect(() => {
    changeBgOnScroll()
    // adding the event when scroll change background
    window.addEventListener("scroll", changeBgOnScroll)
  })

  const openMenu = () => {
    document.getElementById("sidenav").style.width = "70%";
  };

  const closeMenu = () => {
    document.getElementById("sidenav").style.width = "0px";
  };

  return (
    <header className={isScrolled ? `${classname} scrolled` : classname}>
      <nav className="navbar">
        <div className="nav__mobile-box">
          <a
            href={process.env.REACT_APP_FUNDRAISIN_WEBSITE_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <img className="nav__logo" src={logo} alt="logo" />
          </a>
          <img src={ham} className="ham_menu" alt="" onClick={openMenu} />
        </div>
        <div className="nav__menu-box">
          <ul className="nav__menu-items">
            <Link
              to="/#home"
              smooth
              offset={500}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> Home </li>
              <img
                className="nav__menu-item-icon"
                src={catdrop_coral}
                alt="menu"
              />
            </Link>
            <Link
              to="/#top"
              smooth
              offset={-70}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> Top </li>
              <img
                className="nav__menu-item-icon nav__menu-item-icon--reverse"
                src={catdrop_ltblue}
                alt="menu"
              />
            </Link>
            <Link
              to="/#my"
              smooth
              offset={-70}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> My </li>{" "}
              <img
                className="nav__menu-item-icon"
                src={catdrop_blue}
                alt="menu"
              />
            </Link>
            <Link
              to="/#about"
              smooth
              offset={-70}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> About </li>{" "}
              <img
                className="nav__menu-item-icon nav__menu-item-icon--reverse"
                src={catdrop_red}
                alt="menu"
              />
            </Link>
            <NavLink to="/mint" className="nav__menu-item-box" onClick={() => setCurrentPath('')}>
              <li className="nav__menu-item"> Mint </li>{" "}
              <img
                className="nav__menu-item-icon"
                src={catdrop_coral}
                alt="menu"
              />
            </NavLink>
            <NavLink to="/buy" className="nav__menu-item-box" onClick={() => setCurrentPath('')}>
              <li className="nav__menu-item"> Buy </li>{" "}
              <img
                className="nav__menu-item-icon nav__menu-item-icon--reverse"
                src={catdrop_ltblue}
                alt="menu"
              />
            </NavLink>
            <span className="nav__menu-item-box">
              <li
                className="nav__menu-item nav__menu-item-btn"
                onClick={handleWalletClick}
              >
                <div className="nav__menu-item-btn-info">
                  <span className="wallet-addr">
                    {" "}
                    {walletAddress && walletAdr ? walletAdr : "Connect Your Wallet"}
                  </span>

                  <img
                    src={wallet}
                    alt="wallet"
                    className="wallet-icon"
                    style={
                      walletAddress && walletAdr 
                        ? { display: "inline-block" }
                        : { display: "none" }
                    }
                  ></img>
                </div>
              </li>
            </span>
          </ul>
        </div>
        <div id="sidenav" className="nav__menu-box">
          <button className="closebtn" onClick={closeMenu}>
            &times;
          </button>
          <ul className="nav__menu-items">
            <Link
              to="/#home"
              smooth
              offset={500}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> Home </li>
              <img
                className="nav__menu-item-icon"
                src={catdrop_coral}
                alt="menu"
              />
            </Link>
            <Link
              to="/#top"
              smooth
              offset={-70}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> Top </li>
              <img
                className="nav__menu-item-icon nav__menu-item-icon--reverse"
                src={catdrop_ltblue}
                alt="menu"
              />
            </Link>
            <Link
              to="/#my"
              smooth
              offset={-70}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> My </li>{" "}
              <img
                className="nav__menu-item-icon"
                src={catdrop_blue}
                alt="menu"
              />
            </Link>
            <Link
              to="/#about"
              smooth
              offset={-70}
              duration={500}
              className="nav__menu-item-box"
              onClick={() => setCurrentPath('')}
            >
              <li className="nav__menu-item"> About </li>{" "}
              <img
                className="nav__menu-item-icon nav__menu-item-icon--reverse"
                src={catdrop_red}
                alt="menu"
              />
            </Link>
            <NavLink to="/mint" className="nav__menu-item-box" onClick={() => setCurrentPath('mint')}>
              <li className="nav__menu-item"> Mint </li>{" "}
              <img
                className="nav__menu-item-icon"
                src={catdrop_coral}
                alt="menu"
              />
            </NavLink>
            <NavLink to="/buy" className="nav__menu-item-box" onClick={() => setCurrentPath('buy')}>
              <li className="nav__menu-item"> Buy </li>{" "}
              <img
                className="nav__menu-item-icon nav__menu-item-icon--reverse"
                src={catdrop_ltblue}
                alt="menu"
              />
            </NavLink>
            <span className="nav__menu-item-box">
              <li
                className="nav__menu-item nav__menu-item-btn"
                onClick={handleWalletClick}
              >
                <div className="nav__menu-item-btn-info">
                  <span className="wallet-addr">
                    {" "}
                    {walletAddress && walletAdr ? walletAdr : "Connect Your Wallet"}
                  </span>

                  <img
                    src={mobile_wallet}
                    alt="wallet"
                    className="wallet-icon"
                    style={
                      walletAddress && walletAdr 
                        ? { display: "inline-block" }
                        : { display: "none" }
                    }
                  ></img>
                </div>
              </li>
            </span>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Header);
