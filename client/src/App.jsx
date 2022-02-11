import React, { useEffect } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { CartPage } from "./Pages/CartPage";
import { LoginPage } from "./Pages/LoginPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { ProductPage } from "./Pages/ProductPage";
import { useDispatch, useSelector } from "react-redux";
import { listBookCategories } from "./actions/bookActions";
import { SearchPage } from "./Pages/SearchPage";
import { MainPage } from "./Pages/MainPage";
import { signout } from "./actions/userActions";
import { OrderPage } from "./Pages/OrderPage";
import { PrivateRoute } from "./Components/PrivateRoute";
import { ProfilePage } from "./Pages/ProfilePage";
import { SearchBar } from "./Components/SearchBar";
import { ArrowDownward } from "@mui/icons-material";
import { ProductEditPage } from "./Pages/ProductEditPage";
import { ShippingAddressPage } from "./Pages/ShippingAddressPage";
import { PaymentMethodPage } from "./Pages/PaymentMethodPage";
import { PlaceOrderPage } from "./Pages/PlaceOrderPage";
import { OrderHistoryPage } from "./Pages/OrderHistoryPage";
import { AdminRoute } from "./Components/AdminRoute";
import { UserEditPage } from "./Pages/UserEditPage";
import { DashboardPage } from "./Pages/DashboardPage";
import { OrderListPage } from "./Pages/OrderListPage";
import { UserListPage } from "./Pages/UserListPage";
import { SellerRoute } from "./Components/SellerRoute";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ProductListPage } from "./Pages/ProductListPage";
import { ProductCreatePage } from "./Pages/ProductCreatePage";
import { AdminOrSellerRoute } from "./Components/AdminOrSellerRoute";

const App = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };

  useEffect(() => {
    dispatch(listBookCategories());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              Księgarnia
            </Link>
          </div>
          <div>
            <Route
              render={({ history }) => (
                <SearchBar history={history}></SearchBar>
              )}
            ></Route>
          </div>
          <div>
            <Link to="/cart">
              <ShoppingCartIcon />
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.firstName} <ArrowDownward />{" "}
                </Link>{" "}
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">Profil</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Historia zamówień</Link>
                  </li>
                  <li>
                    <Link to="/" onClick={signoutHandler}>
                      Wyloguj się
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/logowanie">Logowanie</Link>
            )}
            {userInfo && userInfo.role === "seller" && (
              <div className="dropdown">
                <Link>
                  Panel sprzedawcy <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist">Produkty</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/page=1">Zamówienia</Link>
                  </li>
                </ul>
              </div>
            )}
            {userInfo && userInfo.role === "admin" && (
              <div className="dropdown">
                <Link to="#admin">
                  Panel Administratora <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Produkty</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/page=1">Zamówienia</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Użytkownicy</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <main>
          <Route path="/cart/:id?" component={CartPage}></Route>
          <Route path="/product/:id" component={ProductPage} exact></Route>
          <Route
            path="/product/:id/edit"
            component={ProductEditPage}
            exact
          ></Route>
          <Route exact path="/createProduct" component={ProductCreatePage} />
          <Route path="/logowanie" component={LoginPage}></Route>
          <Route path="/register" component={RegisterPage}></Route>
          <Route path="/shipping" component={ShippingAddressPage}></Route>
          <Route path="/payment" component={PaymentMethodPage}></Route>
          <Route path="/placeorder" component={PlaceOrderPage}></Route>
          <Route path="/order/:id" component={OrderPage}></Route>
          <Route path="/orderhistory" component={OrderHistoryPage}></Route>
          <Route
            path="/search/title/:title?"
            component={SearchPage}
            exact
          ></Route>
          <Route
            path="/search/category/:category"
            component={SearchPage}
            exact
          ></Route>
          <Route
            path="/search/category/:category/title/:title"
            component={SearchPage}
            exact
          ></Route>
          <Route
            path="/search/category/:category/title/:title/publisher/:publisher/minPrice/:min/maxPrice/:max/order/:order/pageNumber/:pageNumber"
            component={SearchPage}
            exact
          ></Route>
          <AdminOrSellerRoute
            path="/orderList/page=:pageNumber"
            component={OrderListPage}
            exact
          />
          <PrivateRoute path="/profile" component={ProfilePage}></PrivateRoute>
          <AdminOrSellerRoute
            path="/productlist"
            component={ProductListPage}
            exact
          ></AdminOrSellerRoute>
          <AdminOrSellerRoute
            path="/productlist/pageNumber/:pageNumber"
            component={ProductListPage}
            exact
          ></AdminOrSellerRoute>
          <AdminRoute path="/userlist" component={UserListPage}></AdminRoute>
          <AdminRoute
            path="/user/:id/edit"
            component={UserEditPage}
          ></AdminRoute>
          <AdminRoute path="/dashboard" component={DashboardPage}></AdminRoute>

          <Route path="/" component={MainPage} exact></Route>
        </main>
        <footer className="row center">
          <div>Projekt księgarni internetowej - 113119</div>{" "}
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
