import React, { Component } from "react";
import '../../assets/css/App.css'
import greenarrow from "../../assets/images/uparrow.png";
import TableRow from "@mui/material/TableRow";

export default function Row({ arr }) {
  return (
    <>
      <TableRow/>
      
    </>
    // <div className="grid-container">
    //   <div className="grid-item">{arr[0]}</div>
    //   <div className="grid-item">
    //     <span>{arr[1]}</span>
    //     <span><img className="greenarrow" src={greenarrow} alt="greenarrow"></img></span>
    //   </div>
    //   <div className="grid-item">{arr[2]}</div>
    //   <div className="grid-item">{arr[3]}</div>
    //   <div className="grid-item">{arr[4]}</div>
    // </div>
  );
}
