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

export const averageRatingReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case REVIEW_AVERAGE_REQUEST:
      return { loading: true };
    case REVIEW_AVERAGE_SUCCESS:
      return { loading: false, averageRating: action.payload };
    case REVIEW_AVERAGE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
