import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { Link } from "react-router-dom";

export const CartPage = (props) => {
  const bookId = props.match.params.id;
  const quantity = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();
  useEffect(() => {
    if (bookId) {
      dispatch(addToCart(bookId, quantity));
    }
  }, [dispatch, bookId, quantity]);
  const removeFromCarthandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    props.history.push("/logowanie?redirect=shipping");
  };
  return (
    <div className="row top">
      <div className="col-2">
        <h1>Koszyk</h1>
        {cartItems.length === 0 ? (
          <div>
            Koszyk jest pusty <Link to="/">Powrót do zakupów</Link>
          </div>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.book}>
                <div className="row">
                  <div>
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="small"
                    ></img>
                  </div>
                  <div className="min-30">
                    <Link to={`/book/${item.book}`}>{item.title}</Link>
                  </div>
                  <div>
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(addToCart(item.book, Number(e.target.value)))
                      }
                    >
                      {[...Array(item.countinstock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>{item.price} zł</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeFromCarthandler(item.book)}
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul>
            <li>
              <h2>
                Razem ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                przedmiotów):
                {cartItems
                  .reduce((a, c) => a + c.price * c.quantity, 0)
                  .toFixed(2)}{" "}
                zł
              </h2>
            </li>
            <li>
              <button
                type="button"
                onClick={checkoutHandler}
                className="primary block"
                disabled={cartItems.length === 0}
              >
                Przejdź do kasy
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
