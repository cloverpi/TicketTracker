import { useState } from "react";
import { CompanyTicket } from "../electron/lib/dbTypes";

interface Props {
    items: CompanyTicket[];
    onSelect: (company: CompanyTicket) => void;
}

function SearchDropDown( {items, onSelect} : Props ) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleClick = (index: number) => {
    setActiveIndex(-1);
    onSelect(items[index]);
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            key={index}
            className={`list-group-item ${
              activeIndex === index ? "active" : ""
            }`}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => handleClick(index)}
          >
            {item.company}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchDropDown;