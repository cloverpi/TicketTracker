import { useEffect, useState } from "react";

interface Props  {
  company: string | undefined;
}

function TicketAccourdian({company}:Props) {
  const [ activeCord, setActiveCord ] = useState(-1);
  const [lastTickets, setLastTickets] = useState([]);

  useEffect( () => {
    const getTickets = async () => {
      if (!company) return;
      const res = await window.api.findLastTicketsByCompany({company});
      setLastTickets(res);
    }
    getTickets();
    //populate these tickets.
  },[company]);

  // const tickets = [
  //   {serviceid: '   543', problem: `Potatoes aren't cooking`, solution: `Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the first item’s accordion body.`},
  //   {serviceid: '   542', problem: `Fries won't finish`, solution: `Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the second item’s accordion body. Let’s imagine this being filled with some actual content.`},
  //   {serviceid: '   541', problem: `Fries won't: Ding fries are done.`, solution: `Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application of how this would look in a real-world application.of how this would look in a real-world application.of how this would look in a real-world.`}
  // ];

  const handleAccordianClick = (cord: number) => {
    if (activeCord == cord) {
      setActiveCord(-1);
    } else {
      setActiveCord(cord);
    }
  }

  return (
    <>
      <div className="accordion accordion-flush mb-2" id="ticketAccordian">
        {lastTickets.map( (t, i) => (
          <div key={t.serviceid} className="accordion-item">
            <h2 className="accordion-header">
            <button
              id={`${i}`}
              className="accordion-button collapsed"
              type="button"
              onClick={() => handleAccordianClick(i)}
            >
              #{t.serviceid.trim()}: {t.problem}
            </button>
          </h2>
          <div
            id={`flush-collapse${i}`}
            className={`accordion-collapse collapse ${i == activeCord ? 'show' : '' }`}
            data-bs-parent="#ticketAccordian"
          >
            <div className="accordion-body">
              {t.solution}
            </div>
          </div>
        </div>
        ))}
      </div>
    </>
  );
}

export default TicketAccourdian;
