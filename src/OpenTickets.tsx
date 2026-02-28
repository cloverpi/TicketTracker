import { useEffect, useState } from "react";
import { CompanyTicket } from "../electron/lib/dbTypes";
import { getDateString } from "./lib/helpers";

interface Prop {
    onSelect: (v: CompanyTicket | undefined) => void
}

function OpenTickets({onSelect}:Prop) {
  const [openTickets, setOpenTickets] = useState<CompanyTicket[]>([]);
  const [activeRow, setActiveRow] = useState(-1);
  const [hoverRow, setHoverRow] = useState(-1);

  useEffect(() => {
    const getTickets = async () => {
      const res: CompanyTicket[] = await window.api.getOpenTickets();
      setOpenTickets(res);
    }
    getTickets();
  }, []);

  const handleRowClick = (index: number) => {
    onSelect(openTickets[index]);
    setActiveRow(index);
  }

  return (
    <>
      <div
        className="border rounded-4 shadow-sm overflow-auto mb-3"
        style={{ height: "126px" }}
      >
        <table
          style={{ tableLayout: "fixed", width: "100%" }}
          className="table table-striped border mb-0"
          onMouseLeave={()=>setHoverRow(-1)}
        >
          <thead>
            <tr>
              <th scope="col" style={{ width: "100px" }}>
                Date
              </th>
              <th scope="col" style={{ width: "180px" }}>
                Company
              </th>
              <th scope="col">Issue</th>
            </tr>
          </thead>
          <tbody>
            {
              openTickets.map((t, i) => ( 
                <tr key={t.serviceid} id={`${i}`} 
                className={`table-row ${activeRow == i ? 'row-active' : ''} ${hoverRow == i ? 'row-hover' : ''}`}
                onMouseEnter={()=>setHoverRow(i)}
                onClick={()=>handleRowClick(i)}
                >
                  <td>{getDateString(t.daterec) ?? ''}</td>
                  <td className="text-truncate">{t.company}</td>
                  <td className="text-truncate">{t.problem}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OpenTickets;
