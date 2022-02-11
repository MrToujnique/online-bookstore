import {
  CART_ADD_ITEM,
  CART_EMPTY,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_USER_INFO,
} from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find(
        (found) => found.book === item.book
      );
      if (existItem) {
        const obiektTestowy = {
          ...state,
          cartItems: state.cartItems.map((found) =>
            found.book === existItem.book ? item : found
          ),
        };
        return obiektTestowy;
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (found) => found.book !== action.payload
        ),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };
    case CART_SAVE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };
    case CART_EMPTY:
      return { ...state, cartItems: [] };
    case CART_SAVE_USER_INFO:
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
};
