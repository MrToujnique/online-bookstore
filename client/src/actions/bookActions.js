import {
  BOOK_DETAILS_REQUEST,
  BOOK_DETAILS_SUCCESS,
  BOOK_DETAILS_FAIL,
  BOOK_LIST_REQUEST,
  BOOK_LIST_SUCCESS,
  BOOK_LIST_FAIL,
  BOOK_CREATE_REQUEST,
  BOOK_CREATE_FAIL,
  BOOK_CREATE_SUCCESS,
  BOOK_UPDATE_REQUEST,
  BOOK_UPDATE_FAIL,
  BOOK_UPDATE_SUCCESS,
  BOOK_DELETE_FAIL,
  BOOK_DELETE_SUCCESS,
  BOOK_CATEGORY_LIST_REQUEST,
  BOOK_CATEGORY_LIST_SUCCESS,
  BOOK_CATEGORY_LIST_FAIL,
  BOOK_REVIEW_CREATE_REQUEST,
  BOOK_REVIEW_CREATE_SUCCESS,
  BOOK_REVIEW_CREATE_FAIL,
} from "../constants/bookConstants";
import Axios from "axios";
import endpoints from "../endpoints";

export const listBooks =
  ({
    pageNumber = "",
    title = "",
    category = "",
    publisher = "",
    min = 0,
    max = 0,
    order = "",
  }) =>
  async (dispatch) => {
    dispatch({
      type: BOOK_LIST_REQUEST,
    });
    try {
      const { data } = await Axios.get(
        `${endpoints.API_DOMAIN}/books/?pageNumber=${pageNumber}&publisher=${publisher}&title=${title}&category=${category}&min=${min}&max=${max}&order=${order}`
      );
      dispatch({ type: BOOK_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: BOOK_LIST_FAIL, payload: error.message });
    }
  };

export const detailsBookGuest = (bookId) => async (dispatch) => {
  dispatch({ type: BOOK_DETAILS_REQUEST, payload: bookId });
  try {
    const { data } = await Axios.get(`${endpoints.API_DOMAIN}/book/${bookId}`);
    dispatch({ type: BOOK_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BOOK_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const detailsBook = (bookId, userId) => async (dispatch) => {
  dispatch({ type: BOOK_DETAILS_REQUEST, payload: bookId });
  try {
    const { data } = await Axios.get(
      `${endpoints.API_DOMAIN}/book/${bookId}/${userId}`
    );
    dispatch({ type: BOOK_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BOOK_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createBook = (book) => async (dispatch, getState) => {
  dispatch({ type: BOOK_CREATE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(`${endpoints.API_DOMAIN}/books`, book, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: BOOK_CREATE_SUCCESS, payload: data.book });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: BOOK_CREATE_FAIL, payload: message });
  }
};

export const updateBook = (book) => async (dispatch, getState) => {
  dispatch({ type: BOOK_UPDATE_REQUEST, payload: book });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(
      `${endpoints.API_DOMAIN}/book/${book.id}`,
      book,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: BOOK_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: BOOK_UPDATE_FAIL, error: message });
  }
};

export const deleteBook = (bookId) => async (dispatch, getState) => {
  dispatch({ type: BOOK_DETAILS_REQUEST, payload: bookId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.delete(
      `${endpoints.API_DOMAIN}/book/${bookId}`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: BOOK_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: BOOK_DELETE_FAIL, payload: message });
  }
};

export const listBookCategories = () => async (dispatch) => {
  dispatch({
    type: BOOK_CATEGORY_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get(`${endpoints.API_DOMAIN}/categories`);
    dispatch({ type: BOOK_CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: BOOK_CATEGORY_LIST_FAIL, payload: error.message });
  }
};

export const createReview = (bookId, review) => async (dispatch, getState) => {
  dispatch({ type: BOOK_REVIEW_CREATE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      `${endpoints.API_DOMAIN}/review/${bookId}`,
      review,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({
      type: BOOK_REVIEW_CREATE_SUCCESS,
      payload: data.review,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: BOOK_REVIEW_CREATE_FAIL, payload: message });
  }
};
