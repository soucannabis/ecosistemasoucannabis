import React, { useState, useEffect } from "react";
import User from "../../../modules/User";
import apiRequest from "../../../modules/apiRequest";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [formData, setFormData] = useState({});
  const [formValidate, setFormValidate] = useState(false);
  const [formAddress, setFormAddress] = useState(false);
  const [changeAddress, setChangeAddress] = useState([]);
  const [melhorenvioError, setMelhorenvioError] = useState("");

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);

      setFormData({
        street: userData.street,
        number: userData.number,
        neighborhood: userData.neighborhood,
        complement: userData.complement,
        city: userData.city,
        state: userData.state,
        cep: userData.cep
      })
    })()
  }, []);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);

      var melhorenvio = await apiRequest("/api/melhorenvio/shipment-calculate", { cepFrom: "75093750", cepTo: userData.cep }, "POST")

      if (!melhorenvio.error) {
        melhorenvio = melhorenvio.filter(service => service.name === ".Com");
        melhorenvio = melhorenvio.filter(method => !method.error)
        setDelivery(melhorenvio)

        if (items) {
          const products = items.reduce((acc, item) => acc + item.price, 0)
          var discount = coupon.discount
          const deliveryPrice = parseFloat(melhorenvio[0].price)
          var total = 0

          if (coupon && coupon.type != "percentage") {
            total = products - discount
          } else {
            total = parseFloat(products)
          }

          if (!discount) {
            discount = 0
          }

          setCartTotal({ ...cartTotall, products, discount, total, deliveryPrice })

          const inputRadios = document.getElementsByName("deliveryMethod")
          inputRadios.forEach(radio => {
            radio.checked = false;
          });
        }      
      }

      if (melhorenvio.error) {
        setMelhorenvioError(melhorenvio.error)
        setDelivery([])
      }

      setItemsCheckout(items);
    })();
  }, [items, changeAddress]);


  var cartTotal = [];

  if (!items) {
    return <div></div>;
  }

  function deleteItem(value) {
    items = itemsCheckout.filter(item => item.id != value);
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

    const amount = parseFloat(cartTotall.total + cartTotall.delivery).toFixed(2)

    const userFullname = user.name_associate + " " + user.lastname_associate

    const address = formData.street + ", nº " + formData.number + " - " + formData.neighborhood + " - " + formData.complement + " | " + formData.city + " - " + formData.state + " - " + formData.cep
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
      var price = parseFloat((item.price * 100) / item.qntProductCart)

      requestBody.items.push({
        "amount": price,
        "description": item.cod,
        "quantity": item.qntProductCart,
        "code": item.cod,
        "id": item.id
      })
    })

    requestBody.items.push({
      "amount": parseFloat(cartTotall.delivery * 100),
      "description": "Frete Correios",
      "quantity": 1,
      "code": "Frete",
      "id": 1
    })

    var items = requestBody.items
    items = items.filter(item => item.description !== "Frete Correios")

    const createOrder = {
      "user": user.id,
      "total": amount,
      "status": "awaiting-payment",
      "address": address,
      "items": JSON.stringify(items),
      "name_associate": userFullname,
      "delivery_price": cartTotall.delivery,
      "user_code": user.user_code
    }

    const order = await apiRequest("/api/directus/create-order", createOrder, "POST")
    requestBody.code = order.order_code

    const paymentPagarme = await apiRequest("/api/pagarme/orders", requestBody, "POST")
    setLinkPayment(paymentPagarme.checkouts[0].payment_url)
    window.open(paymentPagarme.checkouts[0].payment_url);
  }


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  function editAddress() {
    setFormAddress(true)
    setFormValidate(false)
  }

  async function saveAddress() {
    function inputEmpty(objeto) {
      for (let key in objeto) {
        if (objeto[key] === undefined || objeto[key] === null || objeto[key] === '' || (Array.isArray(objeto[key]) && objeto[key].length === 0)) {
          if (key != "complement") {
            return true;
          }
        }
      }
      return false;
    }

    if (inputEmpty(formData)) {
      setFormValidate(true)
    } else {
      await apiRequest("/api/directus/update", { userId: user.id, formData: formData }, "POST");
      setChangeAddress(formData)
      setFormAddress(false)
    }
  }

  function finishPayment() {
    payment(formData)
  }

  return (
    <div  style={{ overflowY: 'auto', maxHeight: '80%', paddingBottom:"60px" }}>
      <ToastContainer />
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th class="text-center" scope="col">Produto</th>
            <th  class="text-center" scope="col">Qnt.</th>
            <th  class="text-center" scope="col">Preço</th>
            <th  class="text-center" style={{width:"15px"}} scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {itemsCheckout.length == 0 && (<tr class="select-product-text"><td colspan="4">Selecione um produto</td></tr>)}
          {itemsCheckout.map((item, index) => (
            <tr key={item.id}>
              <th scope="row">{index + 1}</th>
              <td class="text-center">{item.name} {item.concentration}</td>
              <td class="text-center">{item.qntProductCart}</td>
              <td class="text-center">R$ {item.price.toFixed(2)}</td>
              <td>
                <svg style={{color:"#cb4343", cursor:"pointer", marginLeft:"15px"}} onClick={() => deleteItem(item.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon-fill" viewBox="0 0 16 16">
  <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
</svg>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3"  style={{paddingTop:"20px"}}className="text-end fw-bold">Frete:</td>
            <td colSpan="2"  style={{paddingTop:"20px"}}>
              {delivery.map((method, index) => (
                <div key={index} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="deliveryMethod"
                    value={method.price}
                    defaultChecked={index === 0}
                    checked
                    hidden
                  />

                 <label className="form-check-label"> Transportadora Jadlog {method.price && (<p>+R${method.price}</p>)}</label>

                </div>
              ))}
              {delivery.length < 1 && <p color="red">o CEP informado é inválido</p>}
            </td>
          </tr>
          <tr>
            <td colSpan="4" className="text-end fw-bold">Total:</td>
            <td colSpan="3" className="fw-bold">
              R$ {parseFloat(cartTotall.products + cartTotall.deliveryPrice).toFixed(2)}
            </td>
          </tr>
          <tr><td colSpan="5" style={{backgroundColor:"#4e774d", padding:"10px 20px", color:"#fff", fontWeight:"700", fontSize:"16px"}}>
            <p class="text-center">Endereço de entrega:</p>
            <p class="text-center">{formData.street}, {formData.number} - {formData.neighborhood} - {formData.city} - {formData.state} - {formData.complement && (<span>{formData.complement} -</span>)} {formData.cep}</p>
            <p class="text-center"> <a style={{cursor:"pointer"}} onClick={editAddress}>Editar Endereço</a></p>

            <form hidden={!formAddress}>
              <div class="form-group">
                <label for="street">Rua:</label>
                <input onChange={handleChange} type="text" class="form-control input-login" id="street" name="street" value={formData.street} />
              </div>
              <div class="form-group">
                <label for="number">Número:</label>
                <input onChange={handleChange} type="text" class="form-control input-login" id="number" name="number" value={formData.number} />
              </div>
              <div class="form-group">
                <label for="complement">Complemento:</label>
                <input onChange={handleChange} type="text" class="form-control input-login" id="complement" name="complement" value={formData.complement} />
              </div>
              <div class="form-group">
                <label for="neighborhood">Bairro:</label>
                <input onChange={handleChange} type="text" class="form-control input-login" id="neighborhood" name="neighborhood" value={formData.neighborhood} />
              </div>
              <div class="form-group">
                <label for="city">Cidade:</label>
                <input onChange={handleChange} type="text" class="form-control input-login" id="city" name="city" value={formData.city} />
              </div>
              <div class="form-group">
                <label for="state">Estado:</label>
                <input onChange={handleChange} type="text" class="form-control input-login" id="state" name="state" value={formData.state} />
              </div>
              <div class="form-group">
                <label for="cep">CEP:</label>
                <InputMask mask="99999-999" value={formData.cep} onChange={handleChange}>
                  {(inputProps) => (
                    <input type="text" class="form-control input-login" id="cep" name="cep" />
                  )}
                </InputMask>

              </div>
              {formValidate && (
                <p class="text-center" style={{ color: "red" }}>
                  Todos os campós precisam estar preenchidos
                </p>
              )}
              <a onClick={saveAddress} class="btn btn-primary">Salvar novo endereço</a>
            </form></td></tr>         
          {coupon && (
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total com desconto:</td>
              <td colSpan="2" className="fw-bold">
                R$ {parseFloat(cartTotall.total + cartTotall.delivery).toFixed(2)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <a onClick={finishPayment} style={{ float: "right" }} hidden={delivery.length < 1} class="btn btn-primary">Finalizar pedido</a>
    </div>
  );
};

export default Cart;
