export default class StockData {
    constructor(name, bidPrice, bidSize, askPrice, askSize) {
      let now = new Date();
      this.name = name;
      this.bidPrice = bidPrice;
      this.bidSize = bidSize;
      this.askPrice = askPrice;
      this.askSize = askSize;
      this.prevAskTime = now;
      this.prevBidTime = now;
      this.askState = 0;
      this.bidState = 0;
    }
  }