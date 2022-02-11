import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";
import { CheckoutSteps } from "../Components/CheckoutSteps";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

export const PlaceOrderPage = (props) => {
  const cart = useSelector((state) => state.cart);
  if (!cart.paymentMethod) {
    props.history.push("/payment");
  }
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const toPrice = (num) => Number(num.toFixed(2));
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;
  cart.userInfo = userInfo;

  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, cartItems: cart.cartItems }));
  };
  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order.id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, order, props.history, success]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Dostawa</h2>
                <p>
                  <strong>Imię i nazwisko:</strong>
                  {cart.shippingAddress.fullName}
                  <br />
                  <strong>Adres: </strong>
                  <br />
                  {cart.shippingAddress.address}
                  <br />
                  {cart.shippingAddress.postalCode}
                  <br />
                  {cart.shippingAddress.city}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Płatność</h2>
                <p>
                  <strong>Metoda: </strong>
                  Stripe
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Zamawiane przedmioty</h2>
                <ul>
                  {cart.cartItems.map((item, id) => (
                    <li key={id}>
                      <div className="row">
                        <div>
                          <img
                            src={item.photo}
                            alt={item.title}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.book}`}>{item.title}</Link>
                        </div>

                        <div>
                          {item.quantity} x {item.price} zł ={" "}
                          {item.quantity * item.price} zł
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body-summary">
            <ul>
              <li>
                <h2>Podsumowanie zamówienia</h2>
              </li>
              <li>
                <div className="row">
                  <div>Przedmioty</div>
                  <div>{cart.itemsPrice.toFixed(2)} zł</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Dostawa</div>
                  <div>{cart.shippingPrice.toFixed(2)} zł</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Cena całkowita</strong>
                  </div>
                  <div>
                    {" "}
                    <strong>{cart.totalPrice.toFixed(2)} zł </strong>
                  </div>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block"
                  disabled={cart.cartItems.length === 0}
                >
                  Złóż zamówienie
                </button>
              </li>
              {loading && <CircularProgress />}
              {error && <div>{error}</div>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
