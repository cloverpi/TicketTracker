import { useEffect, useRef, useState } from "react";
import { CompanyTicket } from "../electron/lib/dbTypes";

interface Props  {
  company: string | undefined;
}

function TicketAccourdian({company}:Props) {
  const [ activeCord, setActiveCord ] = useState(-1);
  const [lastTickets, setLastTickets] = useState<CompanyTicket[]>([]);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);


  useEffect( () => {
    const getTickets = async () => {
      setActiveCord(-1);
      if (containerRef) {
        containerRef.current?.scrollTo({
          top: 0,
        });
      }
      if (!company) return;
      const res: CompanyTicket[] = await window.api.findLastTicketsByCompany({company});
      setLastTickets(res);
    }
    getTickets();
  },[company]);

  const handleAccordianClick = (cord: number) => {
    if (activeCord == cord) {
      setActiveCord(-1);
    } else {
      setActiveCord(cord);
        const item = itemRefs.current[cord];
        if (!item) return;

        item.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }
  }

  return (
    <>
      <div
          className="border rounded-4 shadow-sm overflow-auto mb-4"
          ref={containerRef}
          style={{ height: "201px" }}
          tabIndex={-1}
        >
        <div className="accordion accordion-flush mb-2" id="ticketAccordian">
          {lastTickets.map( (t, i) => (
            <div key={t.serviceid} 
                  className="accordion-item"
                  ref={(el) => (itemRefs.current[i] = el)}
                  >

              <h2 className="accordion-header">
              <button
                id={`${i}`}
                tabIndex={-1}
                className={`accordion-button ${i === activeCord ? "" : "collapsed"}`}
                type="button"
                onClick={() => handleAccordianClick(i)}
              >
                #{t.serviceid?.trim()}: {t.problem}
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
      </div>
    </>
  );
}

export default TicketAccourdian;
