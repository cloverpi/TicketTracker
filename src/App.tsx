import TicketAccourdian from "./TicketAccourdian";
import TicketEntry from "./TicketEntry";
import Company from "./Company";
import TicketSelection from "./TicketSelection";
import { useEffect, useState } from "react";
import Setup from "./Setup";

function App() {
  const [firstRun, setFirstRun] = useState(true);
  
  useEffect( () => {
    const getFirstRun = async () => {
      const res = await window.app.firstRun();
      setFirstRun(res);
      console.log(res);
    }
    getFirstRun();
  }, []);

  const firstLoadView = <>
    <Setup onComplete={() => setFirstRun(false)}/>
  </>

  const mainView = <>
    <TicketSelection />
    {/* <OpenTickets /> */}
    {/* <SearchBar /> */}
    <Company />
    <TicketAccourdian />
    <TicketEntry />
  </>

  return (
    <div className="container-fluid py-2" style={{ width: "99%" }}>
        {firstRun ? firstLoadView : mainView}
    </div>
  );
}

export default App;
