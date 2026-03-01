import TicketEntry from "./TicketEntry";
import Company from "./Company";
import TicketSelection from "./TicketSelection";
import { useEffect, useState } from "react";
import Setup from "./Setup";
import CompanyDetailTabs from "./CompanyDetailTabs";
import { CompanyTicket } from "../electron/lib/dbTypes";
import HintBox from "./components/HintBox";

function App() {
  const [firstRun, setFirstRun] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState <CompanyTicket|undefined> (undefined);
  const [defaultTech, setDefaultTech] = useState('');

  const selectSearch = (v: CompanyTicket | undefined) => {
    setSelectedTicket(v);
  }
  
  useEffect( () => {
    const getFirstRun = async () => {
      const res = await window.app.firstRun();
      setFirstRun(res);
    }
    getFirstRun();
  }, []);

  useEffect( ()=> {
      const getDefaultTech = async () => {
      const {displayName} = await window.app.getCachedSettings();
      setDefaultTech(displayName);
    }
    getDefaultTech();

  },[selectedTicket])

  const ticketComplete = () => {
    setSelectedTicket(undefined);
  }

  const firstLoadView = <>
    <Setup onComplete={() => setFirstRun(false)}/>
  </>

  const mainView = <>
    <TicketSelection onSelect={selectSearch} />
    {selectedTicket && 
    <>
      <Company companyTicket={selectedTicket}/>
      <CompanyDetailTabs companyTicket={selectedTicket} />
      <TicketEntry ticket={selectedTicket} defaultTech={defaultTech} onComplete={ticketComplete} />
    </>}
      {!selectedTicket &&
      <HintBox opacity={50} text={'Create or open a ticket to begin'} />
    }
  </>

  return (
    <div className="container-fluid py-2" style={{ width: "99%" }}>
        {firstRun ? firstLoadView : mainView}
    </div>
  );
}

export default App;
