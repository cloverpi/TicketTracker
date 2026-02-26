import { useState } from "react";
import SearchDropdown from "./SearchDropDown";
import { CompanyTicket } from "../electron/lib/dbTypes";

interface Prop {
    onSelect: (v: CompanyTicket | undefined) => void
}

function SearchBar({onSelect}:Prop) {
  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState('');
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const timeout = 750;
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> | undefined = (e) => {
    const value = e.target.value;
    setSearch(value);
    setLoading(true);
    clearTimeout(searchTimer);
    setSearchTimer(setTimeout(async () => {
      if (value.length > 2) {
        console.log('fetching');
        const results = await window.api.findCompany({query: value});
        setMatches(results);
      }
      if (value.length == 0 ) setMatches([]);
      clearTimeout(searchTimer);
      setLoading(false);
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
        {loading && 
        <div
          className="spinner-border"
          role="status"
          style={{
            position: "absolute",
            right: "12px",
            top: "25%",}}
        />
        }
      </div>
      <SearchDropdown items={matches} onSelect={selectSearchEntry}/>
    </div>
  )
}

export default SearchBar