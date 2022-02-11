/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, listUsers } from "../actions/userActions";
import { USER_DETAILS_RESET } from "../constants/userConstants";
import { CircularProgress } from '@mui/material';

export const UserListPage = (props) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;

  useEffect(() => {
    dispatch(listUsers());
    dispatch({ type: USER_DETAILS_RESET });
  }, [dispatch, successDelete]);
  const deleteHandler = (user) => {
    if (window.confirm(`Czy potwierdzasz usunięcie użytkownika o ID ${user.id}?`)) {
      dispatch(deleteUser(user.id));
    }
  };
  return (
    <div>
      <h1>Użytkownicy</h1>
      {loadingDelete && <CircularProgress/>}
      {errorDelete && <div>{errorDelete}</div>}
      {successDelete && (
        <div>Użytkownik poprawnie usunięty.</div>
      )}
      {loading ? (
        <CircularProgress/>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>IMIĘ</th>
              <th>NAZWISKO</th>
              <th>EMAIL</th>
              <th>ROLA</th>
              <th>AKCJE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => props.history.push(`/user/${user.id}/edit`)}
                  >
                    Edytuj
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(user)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
