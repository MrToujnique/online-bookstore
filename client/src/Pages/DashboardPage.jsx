import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
import { summaryOrder } from "../actions/orderActions";
import { CircularProgress } from "@mui/material";

export const DashboardPage = () => {
  const orderSummary = useSelector((state) => state.orderSummary);
  const { loading, summary, error } = orderSummary;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(summaryOrder());
  }, [dispatch]);

  return (
    <div>
      <div className="row">
        <h1>Dashboard</h1>
      </div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <ul className="row summary">
            <li>
              <div className="summary-title color">
                <span>
                  <i className="fa fa-users" /> Liczba użytkowników
                </span>
              </div>
              <div className="summary-body">{summary.users}</div>
            </li>
            <li>
              <div className="summary-title color">
                <span>
                  <i className="fa fa-money" /> Przychód w tym miesiącu
                </span>
              </div>
              <div className="summary-body">
                {summary.salesThisMonth[0].sum} zł
              </div>
            </li>
            <li>
              <div className="summary-title color">
                <span>
                  <i className="fa fa-shopping-cart" /> Zamówienia (ten miesiąc)
                </span>
              </div>
              <div className="summary-body">
                {summary.ordersThisMonth[0].count
                  ? summary.ordersThisMonth[0].count
                  : 0}
              </div>
            </li>
          </ul>
          <div>
            <h2>Popularność kategorii</h2>
            {summary.productCategories.length === 0 ? (
              <div>Brak kategorii</div>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Wczytywanie wykresu</div>}
                data={[
                  ["name", "count"],
                  ...summary.productCategories.map((x) => [
                    x.name,
                    parseInt(x.count),
                  ]),
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
