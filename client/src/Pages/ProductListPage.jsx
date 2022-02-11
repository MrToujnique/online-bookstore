import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deleteBook, listBooks } from "../actions/bookActions";
import { CircularProgress } from "@mui/material";
import { BOOK_DELETE_RESET } from "../constants/bookConstants";

export const ProductListPage = (props) => {
  const { pageNumber = 1 } = useParams();

  const bookList = useSelector((state) => state.bookList);
  const { loading, error, books, page, pages } = bookList;

  const bookDelete = useSelector((state) => state.bookDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = bookDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successDelete) {
      dispatch({ type: BOOK_DELETE_RESET });
    }
    dispatch(listBooks({ pageNumber }));
  }, [dispatch, props.history, successDelete, userInfo.id, pageNumber]);

  const createHandler = () => {
    props.history.push(`/createProduct`);
  };

  const deleteHandler = (book) => {
    if (
      window.confirm(
        `Czy na pewno chcesz usunąć książkę o ID: ${book.book_id}?`
      )
    ) {
      dispatch(deleteBook(book.book_id));
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="row">
        <h1>Książki</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Stwórz produkt
        </button>
      </div>
      {loadingDelete && <CircularProgress></CircularProgress>}
      {errorDelete && <div variant="danger">{errorDelete}</div>}
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <div variant="danger">{error}</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tytuł</th>
                <th>Autorzy</th>
                <th>Strony</th>
                <th>Cena</th>
                <th>Liczba sztuk</th>
                <th>Kategoria</th>
                <th>Wydawnictwo</th>
                <th>Opis</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.book_id}>
                  <td>{book.book_id}</td>
                  <td>{book.book_title}</td>
                  <td>
                    {book.authors_full_names.map(
                      (item) => item.first_name + " " + item.last_name + ", "
                    )}
                  </td>
                  <td>{book.book_pages}</td>
                  <td>{book.book_price} zł</td>
                  <td>{book.book_countinstock} szt.</td>
                  <td>{book.category_name}</td>
                  <td>{book.publisher_name}</td>
                  <td>{book.book_description}</td>
                  <td>
                    <button
                      type="button"
                      className="small"
                      onClick={() =>
                        props.history.push(`/product/${book.book_id}/edit`)
                      }
                    >
                      Edytuj
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => deleteHandler(book)}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
