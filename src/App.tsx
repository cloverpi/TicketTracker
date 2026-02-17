import TicketAccourdian from "./TicketAccourdian";
import SearchBar from "./SearchBar";
import OpenTickets from "./OpenTickets";
import TicketEntry from "./TicketEntry";
import Company from "./Company";
import TicketSelection from "./TicketSelection";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="container-fluid py-2" style={{ width: "99%" }}>
      <TicketSelection />
      {/* <OpenTickets /> */}
      {/* <SearchBar /> */}
      <Company />
      <TicketAccourdian />
      <TicketEntry />
    </div>
  );
}

export default App;
