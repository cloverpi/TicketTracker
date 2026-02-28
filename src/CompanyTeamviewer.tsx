import { useEffect, useState } from "react";
import { tvDevice } from "../electron/lib/teamviewer";
import Popover from "./components/Popover";

interface Prop {
  devices: tvDevice[]
}

function CompanyTeamviewer({devices}:Prop) {
  const [editingRow, setEditingRow] = useState(-1);
  const [password, setPassword] = useState('');
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [activeRow, setActiveRow] = useState(-1);
  const [hoverRow, setHoverRow] = useState(-1);

  const timeout = 750;

  const handleRowClick = (index: number) => {
    setActiveRow(index);
  }

  const tvStationClick = (index: number) => {
    const id = devices[index].teamviewer_id
    window.app.launchTeamviewer({id});
  }

  const handlePasswordChange = (v: string) => {
    clearTimeout(searchTimer);
    setPassword(v);
    const activeId = devices[activeRow].teamviewer_id
    setSearchTimer(setTimeout(async () => {
        await window.app.setTvPassword({id: activeId, pass: v})
        console.log(devices[activeRow]);
        clearTimeout(searchTimer);
    }, timeout));
  }

  useEffect( () => {
    setEditingRow(-1);
    setActiveRow(-1);
  }, [devices]);

  return (
    <>
      <div
        className="border rounded-4 shadow-sm overflow-auto mb-4"
        style={{ height: "201px" }}
      >
        <table
          style={{ tableLayout: "fixed", width: "100%" }}
          className="table table-striped border mb-0"
          onMouseLeave={()=>setHoverRow(-1)}
        >
          <thead>
            <tr>
                <th scope="col" className="status-cell" style={{ width: "30px" }}>
                    <span className="status header-status" />
                </th>
                <th scope="col" style={{ width: "380px" }}>
                    Teamviewer Station
                </th>
                <th scope="col">Controls</th>
            </tr>
          </thead>
          <tbody>
            {
              devices.map((t, i: number) => (
                <tr key={t.device_id} id={t.device_id} 
                className={`table-row ${activeRow == i ? 'row-active' : ''} ${hoverRow == i ? 'row-hover' : ''}`}
                onMouseEnter={()=>setHoverRow(i)}
                onClick={()=>handleRowClick(i)}
                >
                    <td className="status-cell"><span className={`status ${t.online_state == 'Online' ? 'bg-success' : 'bg-danger'}`} /></td>
                    <td className="text-truncate" onClick={()=>tvStationClick(i)}>{t.alias}</td>
                    <td>
                        {editingRow === i ? (
                            <input
                            type="password"
                            className="form-control password-inline"
                            autoFocus
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            onBlur={() => setEditingRow(-1)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setEditingRow(-1);
                                }
                            }}
                            />
                        ) : (
                          <Popover content={"Change password if different from standard"}>
                            <span
                                className="icon"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                onClick={() => {
                                    setEditingRow(i);
                                    setPassword("");
                                }}
                                style={{ cursor: "pointer" }}
                            >
                            <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="7.5" cy="7.5" r="4.5" />
                                <path d="M12 12l9 9" />
                                <path d="M16 16l2-2" />
                                <path d="M19 19l2-2" />
                            </svg>
                            </span>
                            </Popover>
                        )}
                        </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CompanyTeamviewer;
