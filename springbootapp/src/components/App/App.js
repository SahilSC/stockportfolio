import React, { Component } from "react";
import { useState } from "react";
import Table from "../Table";
// import { StockData } from "../StockData.js"
// import '../../assets/css/App.css'
import "./index.css";
import ChatRoom from "../ChatRoom";
import AddStockButton from "../AddStockButton";
import StockTicker from "../StockTicker/StockTicker";
import StockChart from "../StockChart/StockChart";


export default function App() {

  return (
    <>
      <StockTicker/>
      <Table />
      {/* <StockChart/> */}
    </>
  );
}
