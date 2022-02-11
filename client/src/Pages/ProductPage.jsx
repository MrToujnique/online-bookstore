import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { BOOK_REVIEW_CREATE_RESET } from "./../constants/bookConstants";
import { detailsBook, detailsBookGuest } from "../actions/bookActions";
import { CircularProgress } from "@mui/material";
import { createReview } from "./../actions/bookActions";
import Ratings from "./../Components/Ratings";

export const ProductPage = (props) => {
  const dispatch = useDispatch();
  const bookId = props.match.params.id;
  const [quantity, setQuantity] = useState(1);
  const bookDetails = useSelector((state) => state.bookDetails);
  const { loading, error, book } = bookDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const bookReviewCreate = useSelector((state) => state.bookReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = bookReviewCreate;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  useEffect(() => {
    if (successReviewCreate) {
      window.alert("Pomyślnie dodano recenzję.");
      setRating("");
      setContent("");
      dispatch({ type: BOOK_REVIEW_CREATE_RESET });
    }
    if (userInfo) {
      dispatch(detailsBook(bookId, userInfo.id));
    } else {
      dispatch(detailsBookGuest(bookId));
    }
  }, [dispatch, bookId, successReviewCreate, userInfo]);

  const addToCartHandler = () => {
    props.history.push(`/cart/${bookId}?quantity=${quantity}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (content && rating) {
      dispatch(
        createReview(bookId, {
          rating,
          content,
          name: userInfo.firstName,
          user_id: userInfo.id,
        })
      );
    } else {
      alert("Proszę wprowadzić komentarz i ocenę");
    }
  };
  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <Link to="/">Powrót do wyników</Link>
          <div className="row top">
            <div className="col-2">
              <img
                className="medium"
                src={book.book.photo}
                alt={book.book.title}
              ></img>
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{book.book.title}</h1>
                </li>
                <li>
                  <Ratings
                    rating={book.averageRate[0].averagerating}
                    numReviews={book.countReviews[0].count}
                  />
                </li>
                <li>Cena: {book.book.price} zł</li>
                <li>
                  Autorzy:{" "}
                  {book.book.authors.length !== 0
                    ? book.book.authors.map((item) => {
                        return item.fullName + ", ";
                      })
                    : "Nieznani"}
                </li>
                <li>
                  Wydawnictwo:{" "}
                  {book.book.publisher.name ? book.book.publisher.name : "Brak"}
                </li>
                <li>
                  Opis:
                  <p>{book.book.description}</p>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    <div className="row">
                      <div>Cena</div>
                      <div className="price">{book.book.price} zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Dostępność </div>
                      <div>
                        {book.book.countinstock > 0 ? (
                          <span className="success">Dostępny w magazynie</span>
                        ) : (
                          <span className="danger">Produkt niedostępny</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {book.book.countinstock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Ilość</div>
                          <div>
                            <select
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            >
                              {[...Array(book.book.countinstock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={addToCartHandler}
                          className="primary block"
                        >
                          Dodaj do koszyka
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h2 id="reviews">Recenzje</h2>
            {book.reviews.length === 0 && (
              <div>Brak recenzji dla tego produktu</div>
            )}
            <ul>
              {book.reviews.map((review) => (
                <li key={review.book_id}>
                  <strong>{review.name}</strong>
                  <Ratings rating={review.rating} caption=" " />
                  <p>{review.createdAt}</p>
                  <p>{review.content}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  book.publishedReviewsByUser.length === 0 ? (
                    <form className="form" onSubmit={submitHandler}>
                      <div>
                        <h2>Znasz ten produkt? Podziel się opinią!</h2>
                      </div>
                      <div>
                        <label htmlFor="rating">Ocena</label>
                        <select
                          id="rating"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Wybierz...</option>
                          <option value="1">1 - Kiepski</option>
                          <option value="2">2 - Mierny</option>
                          <option value="3">3 - Przeciętny</option>
                          <option value="4">4 - Dobry</option>
                          <option value="5">5 - Bardzo dobry</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="content">Komentarz</label>
                        <textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          maxLength={1000}
                        ></textarea>
                      </div>
                      <div>
                        <label />
                        <button className="primary" type="submit">
                          Utwórz recenzję
                        </button>
                      </div>
                      <div>
                        {loadingReviewCreate && <CircularProgress />}
                        {errorReviewCreate && <div>{errorReviewCreate}</div>}
                      </div>
                    </form>
                  ) : (
                    <h2>Na tym koncie napisano już recenzję tego produktu.</h2>
                  )
                ) : (
                  <div>
                    Proszę się <Link to="/logowanie">zalogować</Link> aby
                    napisać recenzję.
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
