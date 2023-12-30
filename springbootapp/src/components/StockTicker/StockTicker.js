import React from "react";
import Ticker from "react-ticker";
import TickerBox from "../TickerBox"

import "./index.css";



const stockNames = ["SPY", "DIA", 'AAPL', "GOOGL", "NVDA", "NDAQ"]
export default function StockTicker() {
  return (
    <>
      <Ticker>
        {({ index }) => (
          <>
            <TickerBox key={index%stockNames.length}>{stockNames[index%stockNames.length]}</TickerBox>
            <img src="www.my-image-source.com/" alt="" />
          </>
        )}
      </Ticker>
    </>
  );
}
