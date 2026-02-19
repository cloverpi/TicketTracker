import { useState } from 'react'

function SearchBar() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="form-floating mb-4">
        <input type="text" className="form-control" id="floatingInput" placeholder="" />
        <label htmlFor="floatingInput">Search</label>
      </div>
    </>
  )
}

export default SearchBar