// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/electron-vite.animate.svg'
// import './App.css'
import TicketAccourdian from './TicketAccourdian'
import SearchBar from './SearchBar'
import OpenTickets from './OpenTickets'



function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="container-fluid py-2" style={{ width: "99%" }}>
      <OpenTickets />
      <SearchBar />
      <TicketAccourdian />
    </div>
  )
}

export default App
