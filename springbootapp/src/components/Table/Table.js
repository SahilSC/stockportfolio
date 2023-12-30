import * as React from "react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StockImage from "../StockImage";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import AddStockButton from "../AddStockButton";
import uparrow from "../../assets/images/uparrow.png";
import downarrow from "../../assets/images/downarrow.png";
import StockChart from "../StockChart";
import ImportedChart from "../ImportedChart";
import "./index.css";

import { IPSERVER, IPLOCAL } from "../../utils/constants/IP";

const useIP = IPSERVER;
var subscription = null;
let count = 0;
function createData(name, bidPrice, bidSize, askPrice, askSize) {
  return { name, bidPrice, bidSize, askPrice, askSize };
}

var stompClient = null;
let threshold = 5;
export default function MyTable({ newStock }) {
  const [rendering, setRendering] = useState(true);
  const [rows, setRows] = useState([]);
  const [stockGraphName, setStockGraphName] = useState("");
  // const [subscription, setSubscription] = useState(null);

  function resetToNormal() {
    // let afterThreshold = rowDuplicate.map((row) => {
    //   let d = new Date();
    //   if ((d - row.prevAskTime)/1000 > threshold) {
    //       row.
    //   }
    // })
    let now = new Date();
    // console.log("called " + now.getSeconds());

    setRows((prevRows) => {
      let d = new Date();
      let newarray = prevRows.map((row) => {
        // console.log(row.name + " triggered outside " + (d - row.prevAskTime)/1000)
        // console.log(row);
        let changeAskState = row.askState;
        let changeBidState = row.bidState;
        if ((d - row.prevAskTime) / 1000 > threshold && row.askState !== 0) {
          // console.log(row.name + " triggered " + (d - row.prevAskTime)/1000)
          changeAskState = 0;
        }
        if ((d - row.prevBidTime) / 1000 > threshold && row.bidState !== 0) {
          // console.log(row.name + " triggered2")
          changeBidState = 0;
        }
        let newrow = {
          ...row,
          askState: changeAskState,
          bidState: changeBidState,
        };
        // console.log("NEWSTUFF")
        // console.log(newrow)
        return newrow;
      });
      return newarray;
    });
    // console.log("called ");
  }
  useEffect(() => {
    if (rendering) {
      return;
    }
    console.log("Got new data");
    connect();
    setInterval(resetToNormal, 1000);
    // let index = rows.filter((stock) => stock.name === newStock.name);
  }, [rendering]);

  function connect() {
    let Sock = new SockJS(useIP + "/stocksocket");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
    // .then((subscribedValue) => setSubscription(subscribedValue));
  }

  function onConnected() {
    // stompClient.subscribe("/topic", onMessageReceived);
    // let stockData = createData("AAPL", 10, 20, 30, 40);
    // stompClient.send("/stockapp/getAllStocks", {}, JSON.stringify(stockData));
  }

  function subscribeToNewStock(stockName) {
    stompClient.subscribe("/topic/" + stockName, onMessageReceived, {
      id: stockName,
    });
    console.log("subscribed to: " + stockName);
  }
  // console.log("SUBSCRIPTION")
  // console.log(subscription);
  function onMessageReceived(payload) {
    let payLoadData = JSON.parse(payload.body);
    // console.log("PAYLOAD" + payLoadData);

    let copyRows = rows.slice();

    // copyRows = copyRows.filter((item) => item.name !== payLoadData.name)
    // copyRows.push(payLoadData);
    // if (!copyRows.filter((item) => item.name === payLoadData.name)) {
    //   setRows(copy)
    // }
    let now = new Date();
    // copyRows.push([...rows, [Object.keys(rows).length] : payLoadData]);
    // setRows()
    // console.log("COPY ");
    // console.log(copyRows);
    //works. idk why. didn't work when i just passsed the direct componenet.
    setRows((prevRows) => {
      const updatedRows = prevRows.map((item) => {
        if (item.name === payLoadData.name) {
          payLoadData.askState = 0;
          if (payLoadData.askPrice !== item.askPrice) {
            if (payLoadData.askPrice > item.askPrice) {
              payLoadData.askState = 1;
            } else {
              payLoadData.askState = -1;
            }
            payLoadData.prevAskTime = new Date(now);
          }
          if (payLoadData.bidPrice !== item.bidPrice) {
            if (payLoadData.bidPrice > item.bidPrice) {
              payLoadData.bidState = 1;
            } else {
              payLoadData.bidState = -1;
            }
            payLoadData.prevBidTime = new Date(now);
          }
          payLoadData.prevAskPrice = item.askPrice;
          payLoadData.prevBidPrice = item.bidPrice;
          return payLoadData;
        }
        return item;
      });
      return updatedRows;
    });

    // console.log("Payloaddata: " + payload.body);
  }

  // useEffect(() => {
  //   console.log("Component re-rendered");
  //   setInterval(() =>  {
  //     let changedRows = rows.filter((item) => {

  //     })
  //   }, 1000)
  // }, []);

  function onError(e) {
    console.log(e);
  }

  function handleNewStock(newStock) {
    let index = rows.findIndex((stock) => stock.name === newStock.name);
    if (index !== -1) {
      console.log("Exists");
    } else {
      let copyArray = rows.slice();
      copyArray.push(newStock);
      setRows(copyArray);
      subscribeToNewStock(newStock.name);
      // setRows((prevRows) => return)
    }
  }

  function unsubscribe(stockName) {
    console.log("I am unsubscribing from " + stockName);
    stompClient.unsubscribe(stockName);
    const previousStocks = rows.filter((stock) => stock.name !== stockName);
    setRows(previousStocks);
  }

  function showGraph(stockName) {
    setStockGraphName(stockName);
  }

  useEffect(() => {
    // console.log("mount");
    // fetch(useIP + "/stocks")
    //   .then((response) => response.text())
    //   .then((data) => JSON.parse(data))
    //   .then((data) => {
    //     console.log(data);
    //     let stocks = [];
    //     let d = new Date();
    //     for (let key in data) {
    //       stocks.push({
    //         ...data[key],
    //         prevBidPrice: data[key].bidPrice,
    //         prevAskPrice: data[key].askPrice,
    //         prevBidTime: new Date(d),
    //         prevAskTime: new Date(d),
    //         bidState: 0,
    //         askState: 0,
    //       });
    //     }
    //     setRows(stocks);
    //     setRendering(false);
    //   });
    setRendering(false);
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          {/* <caption>A basic table example with a caption</caption> */}
          <TableHead>
            <TableRow>
              <TableCell>Stock</TableCell>
              {/* <TableCell align="right">Stock Price</TableCell> */}
              {/* add bid price */}
              <TableCell align="right">Bid Price&nbsp;($)</TableCell>
              <TableCell align="right">Bid Size</TableCell>
              <TableCell align="right">Ask Price&nbsp;($)</TableCell>
              <TableCell align="right">Ask Size</TableCell>
              <TableCell align="right" style={{ width: "5%" }}>
                Remove
              </TableCell>
              <TableCell align="right" style={{ width: "5%" }}>
                Graph
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                {/* <TableRow> */}
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  {row.bidPrice} <StockImage change={row.bidState} />
                </TableCell>
                <TableCell align="right">{row.bidSize}</TableCell>
                <TableCell align="right">
                  {row.askPrice} <StockImage change={row.askState} />
                </TableCell>
                <TableCell align="right">{row.askSize}</TableCell>
                {/* <TableCell align="right">{row.protein}</TableCell> */}
                <TableCell align="right">
                  <button
                    className="unsubscribe-button"
                    onClick={() => unsubscribe(row.name)}
                  >
                    -
                  </button>
                </TableCell>
                <TableCell align="right">
                  <button
                    className="graph-button"
                    onClick={() => showGraph(row.name)}
                  >
                    +
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddStockButton addStock={handleNewStock} />
      {/* <ImportedChart canvasHeight={200} /> */}
      <StockChart height={800} width={600}/>
      {/* {stockGraphName !== "" ?  : null} */}
    </>
  );
}
