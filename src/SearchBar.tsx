import { useState } from "react";
import SearchDropdown from "./SearchDropDown";

interface Prop {
    onSelect: (v: any) => void
}

function SearchBar({onSelect}:Prop) {
  const [ matches, setMatches ] = useState([]);
  const [search, setSearch] = useState('');
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);

  const timeout = 750;
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> | undefined = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(searchTimer);
    setSearchTimer(setTimeout(async ()=>{
        const results = await window.api.findByPhone({phone: value});
        console.log('fetching results');
        setMatches(results);
        clearTimeout(searchTimer);
    }, timeout));
  }

  const selectSearchEntry = async (selection: any) => {
    setMatches([]);
    setSearch('');
    onSelect(selection);
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="form-floating mb-4">
        <input
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder=""
          value={search}
          onChange={handleSearch}
        />
        <label htmlFor="floatingInput">Search</label>
      </div>

      <SearchDropdown items={matches} onSelect={selectSearchEntry}/>
    </div>
  )
}

export default SearchBar