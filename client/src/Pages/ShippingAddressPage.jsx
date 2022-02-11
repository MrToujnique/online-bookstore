/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import { CheckoutSteps } from "../Components/CheckoutSteps";

export const ShippingAddressPage = (props) => {
  const userSignin = useSelector((state) => state.userSignin);

  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!userInfo) {
    props.history.push("/signin");
  }
  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    let moveOn = true;
    if (moveOn) {
      dispatch(
        saveShippingAddress({
          fullName,
          address,
          city,
          postalCode,
        })
      );
      props.history.push("/payment");
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Adres dostawy</h1>
        </div>
        <div>
          <label htmlFor="firstName">Imię i nazwisko</label>
          <input
            type="text"
            id="fullName"
            placeholder="Wprowadź imię i nazwisko"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            title="Imię i nazwisko może zawierać od 2 do 60 liter, oraz znaki: spację . ' -"
            pattern="^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ .'-]{2,60}"
            required
            maxLength={60}
          ></input>
        </div>
        <div>
          <label htmlFor="address">Adres</label>
          <input
            type="text"
            id="address"
            placeholder="Wprowadź adres"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            title="Adres musi zawierać od 2 do 60 znaków."
            pattern="^[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ -./]{2,60}"
            required
            maxLength={60}
          ></input>
        </div>
        <div>
          <label htmlFor="city">Miasto</label>
          <input
            type="text"
            id="city"
            placeholder="Wprowadź nazwę swojego miasta"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            title="Miasto musi zawierać od 2 do 50 liter, może zawierać myślnik (-)"
            pattern="^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ -]{2,50}"
            required
            maxLength={50}
          ></input>
        </div>
        <div>
          <label htmlFor="postalCode">Kod pocztowy</label>
          <input
            type="text"
            id="postalCode"
            placeholder="Wprowadź swój kod pocztowy"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            title="Proszę wprowadzić poprawny kod pocztowy (wzór: CC-CCC, gdzie C - cyfra)"
            pattern="^\d{2}[-]{0,1}\d{3}"
            maxLength={6}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Kontynuuj
          </button>
        </div>
      </form>
    </div>
  );
};
