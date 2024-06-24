import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import apiRequest from "../../../modules/apiRequest";
import User from "../../../modules/User";

const ModalPayment = ({ payment, itemsCheckout }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [formAddress, setFormAddress] = useState(false);
  const [resetPassMsg, setResetPassMsg] = useState(false);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [formValidate, setFormValidate] = useState(false);

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



  const handleClose = () => setShowPopup(false);

  function paymentModal() {
    if(itemsCheckout.length > 0){
      setShowPopup(true);
    }
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
          return true;
        }
      }
      return false;
    }

    if (inputEmpty(formData)) {
      setFormValidate(true)
    } else {
      await apiRequest("/api/directus/update", { userId: user.id, formData: formData }, "POST");
      setFormAddress(false)
    }
  }

  function finishPayment() {
    payment(formData)
  }

  return (
    <div>
      <Modal show={showPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirme seus dados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
        </Modal.Body>
      </Modal>
      <a class="text-left text-white lost-pass">
        <a onClick={paymentModal} className="btn btn-success">Realizar pagamento</a>
      </a>
    </div>
  );
};

export default ModalPayment;
