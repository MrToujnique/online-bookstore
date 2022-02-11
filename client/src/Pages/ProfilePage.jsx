import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

export const ProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo.id));
    } else {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setEmail(userInfo.email);
    }
  }, [dispatch, userInfo.id, user]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Hasła się nie zgadzają.");
    } else {
      dispatch(
        updateUserProfile({
          id: userInfo.id,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        })
      );
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Profil użytkownika</h1>
        </div>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            {loadingUpdate && <CircularProgress />}
            {errorUpdate && <div>{errorUpdate}</div>}
            {successUpdate && <div>Pomyślnie zaktualizowano profil</div>}
            <div>
              <label htmlFor="firstName">Imię</label>
              <input
                id="firstName"
                type="text"
                placeholder="Wprowadź imię"
                value={firstName || ""}
                title="Imię musi zawierać od 2 do 30 liter, może zawierać: spację . ' -"
                pattern="^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ .'-]{2,30}"
                required
                maxLength={30}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="lastName">Nazwisko</label>
              <input
                id="lastName"
                type="text"
                placeholder="Wprowadź nazwisko"
                value={lastName || ""}
                title="Nazwisko musi zawierać od 2 do 50 znaków."
                pattern="^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ .'-]{2,50}"
                required
                maxLength={50}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Wprowadź e-mail"
                title="Wprowadź prawidłowy adres e-mail."
                required
                maxLength={50}
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="password">Hasło</label>
              <input
                id="password"
                type="password"
                placeholder="Wprowadź hasło"
                title="Hasło musi posiadać: 8-32 znaków, cyfrę, wielką literę, małą literę"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}"
                onChange={(e) => setPassword(e.target.value)}
                maxLength={32}
              ></input>
            </div>
            <div>
              <label htmlFor="confirmPassword">Powtórz hasło</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Powtórz hasło"
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={32}
              ></input>
            </div>
            <div>
              <label />
              <button className="primary" type="submit">
                Zaktualizuj
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
