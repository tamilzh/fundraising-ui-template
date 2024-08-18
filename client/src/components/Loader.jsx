const Loader = (props) => {
  const loadingCard = () => {
    if (props.loading) {
      return (
        <>
          {[...Array(props.size ? props.size : 4).keys()].map((item) => {
            return (
              <div className="nft-grid-card__wrapper" key={item}>
                <div className="card">
                  <div className="card-loader card-loader--tabs"></div>
                </div>
              </div>
            );
          })}
        </>
      );
    }
  };

  return <>{loadingCard()}</>;
};

export default Loader;
