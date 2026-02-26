import TicketEntry from "./TicketEntry";
import Company from "./Company";
import TicketSelection from "./TicketSelection";
import { useEffect, useState } from "react";
import Setup from "./Setup";
import CompanyDetailTabs from "./CompanyDetailTabs";
import { CompanyTicket } from "../electron/lib/dbTypes";

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

  const firstLoadView = <>
    <Setup onComplete={() => setFirstRun(false)}/>
  </>

  const mainView = <>
    <TicketSelection onSelect={selectSearch} />
    {selectedTicket && <>
      <Company company={selectedTicket?.company || ''}/>
      <CompanyDetailTabs companyTicket={selectedTicket} />
      <TicketEntry ticket={selectedTicket} defaultTech={defaultTech} />
    </>}
  </>

  return (
    <div className="container-fluid py-2" style={{ width: "99%" }}>
        {firstRun ? firstLoadView : mainView}
    </div>
  );
}

export default App;
