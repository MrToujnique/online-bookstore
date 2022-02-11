import Axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants";
import endpoints from "../endpoints";

export const addToCart = (bookId, quantity) => async (dispatch, getState) => {
  const { data } = await Axios.get(`${endpoints.API_DOMAIN}/book/${bookId}`);
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      title: data.book.title,
      pages: data.book.pages,
      photo: data.book.photo,
      price: data.book.price,
      countinstock: data.book.countinstock,
      description: data.book.description,
      book: data.book.id,
      quantity,
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: productId });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
};
