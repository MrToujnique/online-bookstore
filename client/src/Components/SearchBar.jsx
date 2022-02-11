import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

export const SearchBar = (props) => {
  const [title, setTitle] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    props.history.push(`/search/title/${title}`);
  };
  return (
    <form className="search" onSubmit={submitHandler}>
      <div className="row">
        <input
          type="text"
          name="q"
          id="q"
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <button className="primary" type="submit">
          <SearchIcon/>
        </button>
      </div>
    </form>
  );
}
