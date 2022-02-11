import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listBooks } from "./../actions/bookActions";
import { Book } from "../Components/Book";

export const MainPage = () => {
  const dispatch = useDispatch();
  const bookList = useSelector((state) => state.bookList);
  const { loading, error, books } = bookList;

  useEffect(() => {
    dispatch(listBooks({}));
  }, [dispatch]);

  return (
    <div>
      <h2>Wyróżnione produkty</h2>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {books.length === 0 && <div>Nie znaleziono żadnego produktu.</div>}
          <div className="row center">
            {books.map((book) => (
              <Book key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
