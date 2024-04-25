import React, { useState, useEffect } from "react";
import User from "../../../modules/User";
import apiRequest from "../../../modules/apiRequest";
import ModalPayment from "../modals/shopPayment";

const Cart = ({ items, onDeleteItem, coupon }) => {
  const [user, setUser] = useState({});
  const [itemsCheckout, setItemsCheckout] = useState([]);
  const [linkPayment, setLinkPayment] = useState([]);
  const [paymentButton, setPaymentButton] = useState("none");
  const [itemPrice, setItemPrice] = useState(0);
  const [delivery, setDelivery] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [cartTotall, setCartTotal] = useState(0);
  const [cartTotalll, setCartTotalll] = useState(0);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);

      var correios = await apiRequest("/api/correios/shipment-calculate", { cepFrom: "75093750", cepTo: userData.cep }, "POST")
      correios = correios.filter(service => service.name === "PAC" || service.name === "SEDEX");
      correios = correios.filter(method => !method.error)
      setDelivery(correios)
    })();

    if (items) {
      const products = items.reduce((acc, item) => acc + item.price, 0)
      const discount = coupon.discount
      var total = 0
 
      if(coupon && coupon.type != "percentage"){
        total = products - discount
      }else{
        total = (products * discount) / 100
        total = parseInt(products - total)
      }

      setCartTotal({ ...cartTotall, products, discount, total })

      const inputRadios = document.getElementsByName("deliveryMethod")
      inputRadios.forEach(radio => {
        radio.checked = false;
      });

    }

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

    delete cartTotall.delivery
    const inputRadios = document.getElementsByName("deliveryMethod")
    inputRadios.forEach(radio => {
      radio.checked = false;
    });
  }

  const handleRadioChange = (event) => {
    setCartTotal({ ...cartTotall, delivery: parseFloat(event.target.value) })
  };


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

    const amount = parseInt(cartTotall.total + cartTotall.delivery).toFixed(2)

    const userFullname = user.name_associate + " " + user.lastname_associate 

    const address = formData.street + ", nº " + formData.number + " - " + formData.neighborhood + " - " + formData.complement + " | " + formData.city + " - " + formData.state
    const phone = separatePhoneNumber(user.mobile_number);


    var requestBody = {
      "items": [],
      "code": null,
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
          "amount": amount * 100,
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
                  "total": amount * 100
                },
                {
                  "number": 2,
                  "total": amount * 100
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
      var price = parseInt((item.price * 100) / item.qntProductCart)

      requestBody.items.push({
        "amount": price,
        "description": item.cod,
        "quantity": item.qntProductCart,
        "code": item.cod,
        "id": item.id
      })
    })

    requestBody.items.push({
      "amount": parseInt(cartTotall.delivery * 100),
      "description": "Frete Correios",
      "quantity": 1,
      "code": "Frete",
      "id": 1
    })

    var items = requestBody.items

    const createOrder = {
      "user": user.id,
      "total": amount,
      "status": "awaiting-payment",
      "address": address,
      "items": JSON.stringify(items)
    }

    const order = await apiRequest("/api/directus/create-order", createOrder, "POST")
    requestBody.code = order.cod

    const paymentPagarme = await apiRequest("/api/pagarme/orders", requestBody, "POST")
    setLinkPayment(paymentPagarme.checkouts[0].payment_url)
    window.open(paymentPagarme.checkouts[0].payment_url);
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Produto</th>
            <th scope="col">Qnt</th>
            <th scope="col">Preço</th>
            <th scope="col">X</th>
          </tr>
        </thead>
        <tbody>
          {console.log(cartTotall)}
          {itemsCheckout.map(
            (item, index) => (
              cartTotal.push(item.price),
              (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name + item.concentration}</td>
                  <td>{item.qntProductCart}</td>
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
          <tr>
            <td><p style={{ marginTop: "60px" }}>Frete:</p></td>
            <td>
              {delivery.map((method, index) => (
                <div key={index}>
                  <input type="radio" name="deliveryMethod" onChange={handleRadioChange} value={method.price} />
                  <label>{method.name + " - R$" + method.price}</label>
                </div>
              ))}


            </td>
          </tr>
          <tr>
            <td><p style={{ marginTop: "60px" }}>Total:</p> </td>
            <td><p style={{ marginTop: "30px" }}>{parseFloat(cartTotall.products + cartTotall.delivery)}</p> </td>
          </tr>
          <tr>
            <td>Total com desconto: </td>        
              <td> {parseFloat(cartTotall.total + cartTotall.delivery).toFixed(2)}</td>

          </tr>
        </tbody>
      </table>
      <ModalPayment payment={payment} itemsCheckout={itemsCheckout} />
    </div>
  );
};

export default Cart;
