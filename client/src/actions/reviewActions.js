import { Axios } from "axios";
import {
  REVIEW_LIST_REQUEST,
  REVIEW_LIST_SUCCESS,
  REVIEW_LIST_FAIL,
  REVIEW_AVERAGE_REQUEST,
  REVIEW_AVERAGE_SUCCESS,
  REVIEW_AVERAGE_FAIL,
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_CREATE_FAIL,
  REVIEW_CREATE_RESET,
} from "../constants/reviewConstants";
import endpoints from "../endpoints";

export const averageRating = (bookId) => async (dispatch) => {
  dispatch({ type: REVIEW_AVERAGE_REQUEST, payload: bookId });
  try {
    const { data } = await Axios.get(
      `${endpoints.API_DOMAIN}/averageRating/${bookId}`
    );
    dispatch({ type: REVIEW_AVERAGE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REVIEW_AVERAGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
