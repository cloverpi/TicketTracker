import TicketAccourdian from "./TicketAccourdian";
import TicketEntry from "./TicketEntry";
import Company from "./Company";
import TicketSelection from "./TicketSelection";
import { useEffect, useState } from "react";
import Setup from "./Setup";

function App() {
  const [firstRun, setFirstRun] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState <any|undefined> (undefined);

  const selectSearch = (v: any) => {
    setSelectedTicket(v);
  }
  
  useEffect( () => {
    const getFirstRun = async () => {
      const res = await window.app.firstRun();
      setFirstRun(res);
    }
    getFirstRun();
  }, []);

  const firstLoadView = <>
    <Setup onComplete={() => setFirstRun(false)}/>
  </>

  const mainView = <>
    <TicketSelection onSelect={selectSearch} />
    {selectedTicket && <>
      <Company company={selectedTicket?.company || ''}/>
      <TicketAccourdian company={selectedTicket?.company || ''}/>
      <TicketEntry ticket={selectedTicket}/>
    </>}
  </>

  return (
    <div className="container-fluid py-2" style={{ width: "99%" }}>
        {firstRun ? firstLoadView : mainView}
    </div>
  );
}

export default App;
