import { useState } from 'react'

function SearchBar() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="form-floating mb-5">
        <input type="text" className="form-control" id="floatingInput" placeholder="" />
        <label htmlFor="floatingInput">Search</label>
      </div>


      {/* <h1>Vite + React</h1> */}
      {/* <div className="card">
        <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default SearchBar