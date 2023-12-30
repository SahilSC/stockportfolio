import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "APCA-API-KEY-ID": "PKI7GQQZ2V6XNN696FG2",
    "APCA-API-SECRET-KEY": "4PBGdA4G1m71iPn68t9BWYd67FSTQvwvLYEb7gvy",
  },
};

export default function TickerBox({ children }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://data.alpaca.markets/v2/stocks/${children}/snapshot?feed=iex`,
          options
        );
        const data = await response.json();
        const openPrice = data["dailyBar"]["o"];
        setValue(openPrice);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [children]);

  return (
    <Card sx={{ minWidth: 220, backgroundColor: "lightblue" }}>
      <CardContent >
        <Typography variant="h5" component="div">
          {children}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </CardContent>
    </Card>
  );
  
}
