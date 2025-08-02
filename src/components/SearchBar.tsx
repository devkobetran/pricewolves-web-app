import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar: React.FC = () => {
    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Find an item at a good price!"
            />
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </div>
    )
};

export default SearchBar;