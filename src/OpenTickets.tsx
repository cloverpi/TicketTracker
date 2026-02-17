import { useState } from 'react'

function OpenTickets() {
  const [count, setCount] = useState(0)

  return (
    <>
        <h5>Open Tickets</h5>
        <div className="border rounded-4 shadow-sm overflow-hidden">
  <table 
    style={{ tableLayout: "fixed", width: "100%" }}
    className="table table-hover border mb-0"
  >
    <thead>
      <tr>
        <th scope="col" style={{ width: "140px" }}>Date</th>
        <th scope="col" style={{ width: "280px" }}>Company</th>
        <th scope="col">Issue</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mark</td>
        <td className="text-truncate">
          Otto and the guy who knew how and what to eat at all times because he likes food and going to the store and whatever else it is that Mark likes
        </td>
        <td>@mdo</td>
      </tr>
      <tr>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <td>John</td>
        <td>Doe</td>
        <td>@social</td>
      </tr>
    </tbody>
  </table>
</div>

    </>
  )
}

export default OpenTickets





{/* <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>John</td>
      <td>Doe</td>
      <td>@social</td>
    </tr>
  </tbody>
</table> */}