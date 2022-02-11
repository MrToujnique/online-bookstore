import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import { CircularProgress } from "@mui/material";

export const UserEditPage = (props) => {
  const userId = props.match.params.id;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      props.history.push("/userlist");
    }
    if (!user) {
      dispatch(detailsUser(userId));
    } else {
      user.map((item) => {
        setFirstName(item.first_name);
        setLastName(item.last_name);
        setEmail(item.email);
        setRole(item.role);
      });
    }
  }, [dispatch, props.history, successUpdate, user, userId]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        role,
      })
    );
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edycja użytkownika o ID: {userId}</h1>
          {loadingUpdate && <CircularProgress></CircularProgress>}
          {errorUpdate && <div>{errorUpdate}</div>}
        </div>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            <div>
              <label htmlFor="firstName">Imię</label>
              <input
                id="name"
                type="text"
                placeholder="Wprowadź imię"
                value={firstName || ""}
                onChange={(e) => setFirstName(e.target.value)}
                title="Imię musi zawierać od 2 do 30 znaków."
                pattern="^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,30}"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="lastName">Nazwisko</label>
              <input
                id="name"
                type="text"
                placeholder="Wprowadź nazwisko"
                value={lastName || ""}
                onChange={(e) => setLastName(e.target.value)}
                title="Nazwisko musi zawierać od 2 do 50 znaków."
                pattern="^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,50}"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="Wprowadź e-mail"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                title="Wprowadź prawidłowy adres e-mail."
                required
              ></input>
            </div>
            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                htmlFor="role"
              >
                <option>admin</option>
                <option>seller</option>
                <option>user</option>
              </select>
            </div>
            <div>
              <button type="submit" className="primary">
                Zaktualizuj
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
