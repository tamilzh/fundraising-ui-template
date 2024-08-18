import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Audits from "./components/Audits";
import Buy from "./components/Buy";
import Faqs from "./components/Faqs";
import History from "./components/History";
import Home from "./components/HomePage/Home";
import Mint from "./components/Mint/Mint";
import MyPage from "./components/MyPage";
import Widget from "./components/FundsRaised/Widget";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/funds-raised/:type" element={<Widget />} />
        <Route path="/" element={<App />}>
          <Route exact path="" element={<Home />} />
          <Route exact path="/share" element={<Home />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/buy" element={<Buy />}>
            <Route exact path=":tokenId" element={<Buy />} />
          </Route>
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/audit" element={<Audits />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
