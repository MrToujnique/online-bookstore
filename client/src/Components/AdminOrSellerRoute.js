import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

export const AdminOrSellerRoute = ({ component: Component, ...rest }) => {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo &&
        (userInfo.role === "admin" || userInfo.role === "seller") ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="/logowanie" />
        )
      }
    ></Route>
  );
};
