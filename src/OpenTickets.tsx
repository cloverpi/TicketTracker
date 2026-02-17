import { useState } from "react";

function OpenTickets() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div
        className="border rounded-4 shadow-sm overflow-auto mb-4"
        style={{ height: "126px" }}
      >
        <table
          style={{ tableLayout: "fixed", width: "100%" }}
          className="table table-hover table-striped border mb-0"
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
            <tr>
              <td>2026-02-17</td>
              <td className="text-truncate">
                Otto and the guy who knew how and what to eat at all times
                because he likes food and going to the store and whatever else
                it is that Mark likes
              </td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2026-02-17</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>2026-02-17</td>
              <td>Doe</td>
              <td>@social</td>
            </tr>
            <tr>
              <td>2026-02-17</td>
              <td>Doe</td>
              <td>@social</td>
            </tr>
            <tr>
              <td>2026-02-17</td>
              <td>Doe</td>
              <td>@social</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OpenTickets;
