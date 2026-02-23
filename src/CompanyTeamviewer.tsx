import { useEffect, useState } from "react";
import tv from './config/teamviewer.js'
import { createDeviceSearch } from "./lib/helpers.js";

interface Prop {
    company: any;
}

function CompanyTeamviewer({company}:Prop) {
  const [teamviewers, setTeamviewers] = useState<any>([]);
  const [editingRow, setEditingRow] = useState<number | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [activeRow, setActiveRow] = useState(-1);
  const [hoverRow, setHoverRow] = useState(-1);

useEffect(() => {
  const {devices} = tv;
  const engine = createDeviceSearch(devices)

  const results = engine.search(company);
  console.log(results);
  setTeamviewers(results);
  // console.log(devices.map( d=> d.alias ));
  // Prevent running on empty input
  // if (!company || company.length < 2) return;

  // const performSemanticSearch = async () => {
  //   // 1. Load the model (Transformers.js handles the caching automatically)
  //   const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  //   // 2. Vectorize your devices (The "meaning" of your data)
  //   // In a real app, you'd want to memoize 'deviceVectors' so this only happens once
  //   const { devices } = tv;
  //   const deviceVectors = await Promise.all(
  //     devices.map(async (d) => ({
  //       ...d,
  //       embedding: (await pipe(d.alias, { pooling: 'mean', normalize: true })).data
  //     }))
  //   );

  //   // 3. Vectorize the search query (The "meaning" of your search)
  //   const queryResult = await pipe(company, { pooling: 'mean', normalize: true });
  //   const queryEmbedding = queryResult.data;

  //   // 4. Score them by semantic similarity
  //   const scored = deviceVectors.map(device => ({
  //     ...device,
  //     // cos_sim returns 1.0 for perfect meaning match, 0.0 for unrelated
  //     score: cos_sim(queryEmbedding, device.embedding)
  //   }));

  //   // 5. Sort and Update State
  //   const topMatches = scored
  //     .sort((a, b) => b.score - a.score)
  //     .slice(0, 15);

  //   setTeamviewers(topMatches);
  // };

  // performSemanticSearch().catch(console.error);
}, [company]);

  const handleRowClick = (index: number) => {
    setActiveRow(index);
  }

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
                <th scope="col" style={{ width: "300px" }}>
                    Teamviewer Station
                </th>
                <th scope="col">Controls</th>
            </tr>
          </thead>
          <tbody>
            {
              teamviewers.map((t, i: number) => (
                <tr key={t.device_id} id={t.device_id} 
                className={`table-row ${activeRow == i ? 'row-active' : ''} ${hoverRow == i ? 'row-hover' : ''}`}
                onMouseEnter={()=>setHoverRow(i)}
                onClick={()=>handleRowClick(i)}
                >
                    <td className="status-cell"><span className={`status ${t.online_state == 'Online' ? 'bg-success' : 'bg-danger'}`} /></td>
                    <td className="text-truncate">{t.alias}</td>
                    <td>
                        {editingRow === i ? (
                            <input
                            type="password"
                            className="form-control password-inline"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setEditingRow(-1)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setEditingRow(-1);
                                }
                            }}
                            />
                        ) : (
                            <span
                                className="icon"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Change password if different from standard"
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
