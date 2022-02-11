import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, listOrders } from "../actions/orderActions";
import { ORDER_DELETE_RESET } from "../constants/orderConstants";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export const OrderListPage = (props) => {
  const { pageNumber = 1 } = useParams();
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;
  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const sellerMode = userInfo.role === "seller";
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders({ pageNumber }));
  }, [dispatch, successDelete, userInfo.id, pageNumber]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    return `/orderlist/page=${filterPage}`;
  };

  const deleteHandler = (order) => {
    if (window.confirm(`Czy chcesz usunąć pozycję o ID: ${order.id}?`)) {
      dispatch(deleteOrder(order.id));
    }
  };
  return (
    <div>
      <div>
        <h1>Historia zamówień</h1>
        {loadingDelete && <CircularProgress />}
        {errorDelete && <div>{errorDelete}</div>}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div>{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Użytkownik</th>
                <th>Data</th>
                <th>Razem</th>
                <th>Opłacono</th>
                <th>Data wysłania</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer.fullName}</td>
                  <td>{order.issuedAt.substring(0, 10)}</td>
                  <td>{parseFloat(order.totalPrice).toFixed(2)} zł</td>
                  <td>
                    {order.isPaid
                      ? order.paidAt
                          .replace("Z", " ")
                          .replace("T", " ")
                          .replace(/.{0,5}$/, " ")
                      : "Nie"}
                  </td>

                  <td>
                    {order.isDelivered
                      ? order.deliveredAt
                          .replace("Z", " ")
                          .replace("T", " ")
                          .replace(/.{0,5}$/, " ")
                      : "Nie wysłano"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="small"
                      onClick={() => {
                        props.history.push(`/order/${order.id}`);
                      }}
                    >
                      Szczegóły
                    </button>
                    {sellerMode ? (
                      <div />
                    ) : (
                      <button
                        type="button"
                        className="small"
                        onClick={() => deleteHandler(order)}
                      >
                        Usuń
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="row center pagination">
        {[...Array(pages).keys()].map((x) => (
          <Link
            className={x + 1 === page ? "active" : ""}
            key={x + 1}
            to={getFilterUrl({ page: x + 1 })}
          >
            {x + 1}
          </Link>
        ))}
      </div>
    </div>
  );
};
