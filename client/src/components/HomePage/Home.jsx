import React from "react";
import Hero from "./Hero";
import TopFund from "./TopFund";
import MyNft from "./MyNft";
import Wagmi from "./Wagmi";
import HowUnique from "./HowUnique";
import { useOutletContext, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const tokenId = queryParams.get("tokenId");
  if (tokenId != null) {
    navigate(`/buy/${tokenId}`);
  }
  const [
    siteDetails,
    walletAddress,
    connectWallet,
    isWalletConnected,
    nftData,
    ,
    nftTop,
    loading,
    topLoading,
    ,
    ,
  ] = useOutletContext();

  if (tokenId !== null) {
    return null;
  } else {
    return (
      <div>
        <Hero siteDetails={siteDetails} />
        <TopFund
          siteDetails={siteDetails}
          connectWallet={connectWallet}
          isWalletConnected={isWalletConnected}
          nftTop={nftTop}
          loading={topLoading}
        />
        <MyNft
          walletAddress={walletAddress}
          nftData={nftData}
          loading={loading}
        />
        <HowUnique />
        <Wagmi />
      </div>
    );
  }
};

export default Home;
