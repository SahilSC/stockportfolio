import React, { useState } from "react";
import "./index.css";
import { IPSERVER, IPLOCAL } from "../../utils/constants/IP";

const useIP = IPSERVER;

export default function AddStockButton({ addStock }) {
  const [input, setInput] = useState("");
  // console.log("FETCHED")
  // const [inputStock, setInputStock] = useState("");
  // const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  function fetchStock() {
    if (input.length > 0) {
      console.log("FETCHED");
      fetch(useIP + "/getStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: input }),
      })
        .then((response) => {
          console.log("coming here");
          console.log(response.ok);
          if (!response.ok) throw new Error("Invalid stock");
          const a = response.json();
          console.log(a);
          return a;
        })
        .then((data) => {
          console.log(data);
          // setStockData(new StockData(data.name, data.bidPrice, data.bidSize, data.askPrice, data.askSize));
          let d = new Date();
          let newStock = {
            ...data,
            prevBidTime: d,
            prevAskTime: d,
            askState: 0,
            bidState: 0,
          };
          setInput("");
          setError("");
          addStock(newStock);
        })
        .catch((err) => {
          console.log("ERROR");
          console.log(err);
          // setInput("");
          setError("Stock does not exist");
        });
    }
  }

  
  return (
    <>
      <div className="add-stock-button">
        {/* <label for="stock-symbol"></label> */}
        <input
          id="stock-symbol"
          placeholder="Enter stock name"
          maxLength={6}
          value={input}
          onChange={(e) => {
            setInput(e.target.value.toUpperCase());
          }}
        ></input>
        <button
          onClick={() => {
            if (input.length < 3) return;
            fetchStock();
            console.log(input);
            
            
          }}
        >
          Add Stock
        </button>
      <div className="error">{error}</div>
      </div>
    </>
  );
}
