import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signin } from "../actions/userActions";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);

  return (
    <>
      <div>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Logowanie</h1>
          </div>
          {loading && <CircularProgress />}
          {error && <div>{error}</div>}
          <div>
            <label htmlFor="email">Adres e-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Wprowadź email"
              required
              maxLength={50}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              id="password"
              placeholder="Wprowadź hasło"
              required
              maxLength={32}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div>
            <label />
            <button className="primary" type="submit">
              Zaloguj
            </button>
          </div>
          <div>
            <label />
            <div>
              Nowy klient?{" "}
              <Link to={`/register?redirect=${redirect}`}>Stwórz konto</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
