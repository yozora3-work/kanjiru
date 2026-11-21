import { SearchIcon } from "lucide-react";
import Button from "./Button";

function SearchBar({
  searchField,
  setSearchField,
  searchData,
  placeholder = "Search",
}) {
  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        placeholder={placeholder}
      />
      <Button
        type="button"
        className="button-ui-action"
        onClick={() => searchData()}
        text={"Search"}
        icon={<SearchIcon />}
      />
    </div>
  );
}

export default SearchBar;
