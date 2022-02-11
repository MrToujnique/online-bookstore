import {
  AUTHOR_LIST_REQUEST,
  AUTHOR_LIST_SUCCESS,
  AUTHOR_LIST_FAIL,
} from "../constants/authorConstants";

export const authorListReducer = (state = { authorsAPI: [] }, action) => {
  switch (action.type) {
    case AUTHOR_LIST_REQUEST:
      return { loadingAuthors: true };
    case AUTHOR_LIST_SUCCESS:
      return {
        loadingAuthors: false,
        authorsAPI: action.payload.authors,
      };
    case AUTHOR_LIST_FAIL:
      return { loadingAuthors: false, errorAuthors: action.payload };
    default:
      return state;
  }
};
