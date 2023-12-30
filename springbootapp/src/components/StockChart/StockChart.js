import React from 'react'
import ImportedChart from "../ImportedChart"
import "./index.css"
export default function StockChart({height = 400, width = 700}) {
  console.log("STOCK CHART HEIGHT:" + height)
  return (
    <>
    <div className="graph-container">
    <ImportedChart canvasHeight={height} canvasWidth={width}/>
    </div>
    </>
  )
}
