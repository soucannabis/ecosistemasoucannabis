import React, { useState, useEffect } from "react";
import User from "../../../modules/User";
import apiRequest from "../../../modules/apiRequest";
import ModalPayment from "../modals/shopPayment";

const Cart = ({ items, onDeleteItem }) => {
  const [user, setUser] = useState({});
  const [itemsCheckout, setItemsCheckout] = useState([]);
  const [linkPayment, setLinkPayment] = useState([]);
  const [paymentButton, setPaymentButton] = useState("none");


  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();
    setItemsCheckout(items);
  }, [items]);

  var cartTotal = [];

  if (!items) {
    return <div></div>;
  }

  function deleteItem(event) {
    event.preventDefault();
    items = itemsCheckout.filter(item => item.id != event.target.value);
    setItemsCheckout(items);
    onDeleteItem(items)
  }

  const payment = async function payment(formData) {

    function separatePhoneNumber(phoneNumber) {
      var regex = /^(\d{2})(\d{2})(\d{9})$/;
      var parts = phoneNumber.match(regex);

      var countryCode = parts[1];
      var areaCode = parts[2];
      var phoneNumber = parts[3];
      return {
        countryCode: countryCode,
        areaCode: areaCode,
        phoneNumber: phoneNumber
      };
    }

    const userFullname = user.name_associate + " " + user.lastname_associate
    const amount = parseInt((cartTotal.reduce((total, valor) => total + valor, 0).toFixed(2)) * 100)
    const address = formData.street + " - " + formData.number + " - " + formData.neighborhood + " - " + formData.complement
    const phone = separatePhoneNumber(user.mobile_number);

    var requestBody = {
      "items": [],
      "code": user.user_code,
      "customer": {
        "name": userFullname,
        "email": user.email_account,
        "birthdate": user.birthday_associate,
        "phones": {
          "mobile_phone": {
            "country_code": phone.countryCode,
            "area_code": phone.areaCode,
            "number": phone.phoneNumber
          }
        },
      },
      "payments": [
        {
          "amount": amount+100,
          "payment_method": "checkout",
          "checkout": {
            "expires_in": 120,
            "billing_address_editable": false,
            "billing_address": {
              "line_1": address,
              "zip_code": formData.cep,
              "city": formData.city,
              "state": formData.state,
              "country": "BR"
            },
            "customer_editable": true,
            "accepted_payment_methods": [
              "credit_card",
              "boleto",
              "pix"
            ],
            "success_url": "http://216.238.102.56:3000/loja",
            "boleto": {
              "bank": "033",
              "instructions": "Pagar até o vencimento",
              "due_at": "2025-07-25T00:00:00Z"
            },
            "credit_card": {
              "installments": [
                {
                  "number": 1,
                  "total": amount
                },
                {
                  "number": 2,
                  "total": amount
                }
              ]
            },
            "payment_method": "pix",
            "pix": {
              "expires_in": "52134613",
              "additional_information": [
                {
                  "name": "Quantidade",
                  "value": "2"
                }
              ]
            }
          }
        }
      ]
    }

    itemsCheckout.forEach(item => {
      const itemPrice = parseInt(item.price * 100)
      requestBody.items.push({
        "amount": itemPrice,
        "description": item.name,
        "quantity": 1,
        "code": item.cod
      })
    }) 

    const paymentPagarme = await apiRequest("/api/pagarme/orders", requestBody, "POST")
    setLinkPayment(paymentPagarme.checkouts[0].payment_url)
    window.location.assign(paymentPagarme.checkouts[0].payment_url);
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Produto</th>
            <th scope="col">Tipo</th>
            <th scope="col">Preço</th>
            <th scope="col">X</th>
          </tr>
        </thead>
        <tbody>
          {itemsCheckout.map(
            (item, index) => (
              cartTotal.push(item.price),
              (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name + item.concentration}</td>
                  <td>{item.type}</td>
                  <td>{item.price}</td>
                  <td>
                    <button onClick={deleteItem} value={item.id}>
                      X
                    </button>
                  </td>
                </tr>
              )

            )
          )}
          <tr></tr>
          <tr>
            <th></th>
            <td></td>
            <td>Total: </td>
            <td> {(cartTotal.reduce((total, valor) => total + valor, 0).toFixed(2))}</td>
          </tr>
        </tbody>
      </table>
      <ModalPayment payment={payment} itemsCheckout={itemsCheckout}/>      
    </div>
  );
};

export default Cart;
