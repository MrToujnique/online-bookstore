import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { detailsOrder } from "../actions/orderActions";
import Axios from "axios";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import StripeCheckout from "react-stripe-checkout";
import endpoints from "../endpoints";
import { payOrder } from "./../actions/orderActions";
import { payHandler } from "./../actions/orderActions";
import { deliverOrder } from "./../actions/orderActions";

export const OrderPage = (props) => {
  toast.configure();
  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!order || (order && order[0].purchase_id !== Number(orderId))) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } else if (!order[0].purchase_is_paid) {
      setSdkReady(true);
    }
  }, [dispatch, order, orderId, sdkReady, successPay, successDeliver]);

  async function handleToken(token) {
    const response = await Axios.post(`${endpoints.API_DOMAIN}/payment`, {
      token,
      order,
    });
    const { status } = response.data;

    if (status === "success") {
      dispatch(payOrder(order, token));
    } else {
      toast("Ups! Coś poszło nie tak!", { type: "error" });
    }
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order[0].purchase_id));
    dispatch(detailsOrder(orderId));
    props.history.push(`/orderlist/page=1`);
  };

  return loading ? (
    <CircularProgress />
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      {userInfo.id === order[0].users_id ||
      userInfo.role === "seller" ||
      userInfo.role === "admin" ? (
        <>
          <h1>Zamówienie nr {order[0].purchase_id}</h1>
          <div className="row top">
            <div className="col-2">
              <ul>
                <li>
                  <div className="card card-body">
                    <h2>Dane dostawy</h2>
                    <p>
                      <strong>Imię i nazwisko: </strong>
                      <br />
                      {order[0].customer_full_name}
                      <br />
                      <strong>Adres: </strong>
                      <br />
                      {order[0].customer_address}
                      <br />
                      {order[0].customer_postal_code},{order[0].customer_city}
                    </p>
                    {order[0].purchase_is_delivered ? (
                      <div>
                        Wysłano dnia:
                        <br />
                        {order[0].purchase_delivered_at
                          .replace("Z", " ")
                          .replace("T", " ")
                          .replace(/.{0,5}$/, " ")}
                      </div>
                    ) : (
                      <div>Nie wysłano</div>
                    )}
                  </div>
                </li>
                <li>
                  <div className="card card-body">
                    <h2>Płatność</h2>
                    <p>
                      <strong>Metoda: </strong>
                      <br />
                      Stripe
                    </p>
                    {order[0].purchase_is_paid ? (
                      <div>
                        Zapłacono dnia: <br />{" "}
                        {order[0].purchase_paid_at
                          .replace("Z", " ")
                          .replace("T", " ")
                          .replace(/.{0,5}$/, " ")}
                      </div>
                    ) : (
                      <div>Nie zapłacono</div>
                    )}
                  </div>
                </li>
                <li>
                  <div className="card card-body">
                    <h2>Przedmioty w zamówieniu</h2>
                    <ul>
                      {order.map((item, id) => (
                        <li key={id}>
                          <div className="row">
                            <div>
                              <img
                                src={item.book_photo}
                                alt={item.book_title}
                                className="small"
                              ></img>
                            </div>
                            <div className="min-30">
                              <Link to={`/product/${item.book_id}`}>
                                {item.book_title}
                              </Link>
                            </div>

                            <div>
                              {item.suborder_quantity} x {item.book_price} zł ={" "}
                              {item.suborder_quantity * item.book_price} zł
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
                      <div>{order[0].purchase_items_price} zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Dostawa</div>
                      <div>{order[0].purchase_shipping_price} zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>
                        <strong>Cena całkowita:</strong>
                      </div>
                      <div>
                        {" "}
                        <strong>
                          {parseFloat(order[0].purchase_total_price).toFixed(2)}{" "}
                          zł
                        </strong>
                      </div>
                    </div>
                  </li>
                  {!order[0].purchase_is_paid && (
                    <li>
                      {!sdkReady ? (
                        <CircularProgress />
                      ) : (
                        <>
                          {errorPay && <div>{errorPay}</div>}
                          {loadingPay && <CircularProgress />}
                          {userInfo.id === order[0].users_id && (
                            <StripeCheckout
                              stripeKey="Tu należy wprowadzić publiczny klucz Stripe API"
                              token={handleToken}
                              amount={Number(
                                order[0].purchase_total_price * 100
                              )}
                              name={`Zamówienie nr ${order[0].purchase_id}`}
                              currency="PLN"
                              billingAddress
                            />
                          )}
                        </>
                      )}
                    </li>
                  )}
                  {(userInfo.role === "admin" || userInfo.role === "seller") &&
                    order[0].purchase_is_paid &&
                    !order[0].purchase_is_delivered && (
                      <li>
                        {loadingDeliver && <CircularProgress />}
                        {errorDeliver && <div>{errorDeliver}</div>}
                        <button
                          type="button"
                          className="primary block"
                          onClick={deliverHandler}
                        >
                          Zamówienie dostawy
                        </button>
                      </li>
                    )}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <p>Nie masz dostępu do tej strony.</p>
        </div>
      )}
    </div>
  );
};
