import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrderMine } from "../actions/orderActions";

export const OrderHistoryPage = (props) => {
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders } = orderMineList;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);
  return (
    <div>
      <h1>Historia zamówień</h1>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Razem sztuk</th>
              <th>Suma</th>
              <th>Opłacono</th>
              <th>Wysłano</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.issuedAt.substring(0, 10)}</td>
                <td>{order.quantitySum}</td>
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
                    ? order.deliveredAt.substring(0, 10)
                    : "Nie"}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
