import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { register } from "../actions/userActions";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export const RegisterPage = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Hasła się nie zgadzają.");
    } else {
      dispatch(register(firstName, lastName, email, password));
    }
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
          <h1>Rejestracja</h1>
          {loading && <CircularProgress />}
          {error && <div>{error}</div>}
          <div>
            <label htmlFor="name">Imię</label>
            <input
              type="text"
              id="name"
              title="Imię musi zawierać od 2 do 30 liter, może zawierać: spację . ' -"
              pattern="^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ .'-]{2,30}"
              required
              maxLength={30}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="name">Nazwisko</label>
            <input
              type="text"
              id="name"
              placeholder="Wprowadź nazwisko"
              title="Nazwisko musi zawierać od 2 do 50 znaków."
              pattern="^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ .'-]{2,50}"
              required
              onChange={(e) => setLastName(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Wprowadź email"
              title="Wprowadź prawidłowy adres e-mail."
              maxLength={50}
              required
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              id="password"
              placeholder="Wprowadź hasło"
              title="Hasło musi posiadać: 8-32 znaków, cyfrę, wielką literę, małą literę"
              pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}"
              required
              maxLength={32}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="confirmPassword">Powtórz hasło</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Powtórz hasło"
              required
              maxLength={32}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
          </div>
          <div>
            <label />
            <button className="primary" type="submit">
              Zarejestruj
            </button>
          </div>
          <div>
            <label />
            <div>
              Posiadasz już konto?{" "}
              <Link to={`/logowanie?redirect=${redirect}`}>Zaloguj się</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
