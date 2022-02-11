import axios from "axios";
import endpoints from "../endpoints";
import {
  AUTHOR_LIST_REQUEST,
  AUTHOR_LIST_SUCCESS,
  AUTHOR_LIST_FAIL,
} from "./../constants/authorConstants";

export const listAuthors =
  ({ firstName = "", lastName = "" }) =>
  async (dispatch) => {
    dispatch({
      type: AUTHOR_LIST_REQUEST,
    });
    try {
      const { data } = await axios.get(
        `${endpoints.API_DOMAIN}/authors/?firstName=${firstName}&lastName=${lastName}`
      );
      dispatch({ type: AUTHOR_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: AUTHOR_LIST_FAIL, payload: error.message });
    }
  };
