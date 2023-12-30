import "./index.css";
import uparrow from "../../assets/images/uparrow.png";
import downarrow from "../../assets/images/downarrow.png";

export default function StockImage({ change }) {
    let image = null;
    if (change > 0) {
        image = uparrow;
    }
    else if (change < 0) {
        image = downarrow;
    }
  return (
    <>{image ? <img src={image} alt="nothin" className="arrow"></img> : null}</>
  );
}
