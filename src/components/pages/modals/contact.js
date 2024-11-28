import React, { useState, useEffect } from "react";
import User from "../../../modules/User";
import apiRequest from "../../../modules/apiRequest";
import EmailInput from "../../forms/EmailInput";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Modal from "react-bootstrap/Modal";
import PhoneInputs from "../../forms/PhoneNumberInput";

const Contact = ({ type }) => {
  const [user, setUser] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [inputError, setInputError] = useState(false);
  const [submit, setSumbit] = useState(true);
  const [msgWhats, setMsgWhats] = useState(false);
  const [errorConn, setErrorConn] = useState(false);
  const [msgWhatsError, setMsgWhatsError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [resetPassMsg, setResetPassMsg] = useState(false);
  const [MsgAppointment, setAppointmentMsg] = useState(false);

  const handleClose = () => setShowPopup(false);
  const handleShow = () => setShowPopup(true);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();
  }, []);

  var formInfo = {};

  if (type == "appointment") {
    formInfo = {
      name: null,
      phone: null,
      email: null,
      // message: "Olá, gostaria de agendar uma consulta médica.",
      type: 1,
    };
  } else {
    formInfo = {
      name: null,
      phone: null,
      email: null,
      // message: null,
      type: 0,
    };
  }

  const [message, setMessage] = useState(formInfo);

  const contact = async event => {
    event.preventDefault();

    if (import.meta.env.VITE_UTALK) {
      if (type != "appointment") {
        await fetch("https://n8n.soucannabis.ong.br/webhook/da23155e-90a5-486e-9e74-9d1ece12e82d", {
          method: "POST",
          body: JSON.stringify({
            form: "contato",
            message: message,
            username: user.name_associate,
            lastname: user.lastname_associate,
            email: user.email_account,
            phone: user.mobile_number,
          }),
        });
        setTimeout(() => {
          closeModal();
        }, 4000);
        setMsgWhats(true);
        setTimeout(() => {
          setMsgWhats(false);
        }, 6000);
      } else {
        setAppointmentMsg(true);

        await fetch("https://n8n.soucannabis.ong.br/webhook/da23155e-90a5-486e-9e74-9d1ece12e82d", {
          method: "POST",
          body: JSON.stringify({
            form: "agendamento",
            username: user.name_associate,
            lastname: user.lastname_associate,
            email: user.email_account,
            phone: user.mobile_number,
          }),
        });

        setTimeout(() => {
          setMsgWhats(false);
        }, 6000);

        await apiRequest("/api/directus/update", { userId: user.id, formData: { associate_status: 7, status: "aguardando-aprovacao" } }, "POST");
      }

      if (type == "appointment") {
        setTimeout(() => {
          window.location.assign("/cadastro");
        }, 7000);
      }
    } else {
      formInfo.phone = user.mobile_number;
      formInfo.name = user.name_associate;
      formInfo.email = user.email_account;

      if (type != "appointment") {
        formInfo.message = message;
      } else {
        formInfo.message = message.message;
      }

      await apiRequest("/api/chatwoot/send-message-api", JSON.stringify(formInfo), "POST")
        .then(response => {
          if (response != []) {
            setMsgWhats(true);
            setTimeout(() => {
              setMsgWhats(false);
            }, 6000);
          } else {
            setErrorConn(true);
          }
        })
        .catch(error => {
          console.error(error);
        });

      const phone = "+" + formInfo.phone;
      await apiRequest(
        "/api/chatwoot/send-message-chat",
        JSON.stringify({
          email: formInfo.email,
          name: formInfo.name,
          phone_number: phone,
          message: formInfo.message,
          type: type,
        }),
        "POST"
      ).catch(error => {
        console.error(error);
      });
    }
  };

  function openModal() {
    setShowPopup(true);
  }

  function closeModal() {
    setShowPopup(false);
  }

  function handleChangeInput(event) {
    event.preventDefault();
    setMessage(event.target.value);
  }

  return (
    <div>
      <Modal show={showPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          {type == "appointment" && <Modal.Title>Solicitação de agendamento</Modal.Title>}

          {type != "appointment" && <Modal.Title>Solicitação de contato</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={contact}>
            {errorConn && (
              <div class="alert alert-warning" role="alert">
                Houve um erro na conexão, entre em contato{" "}
                <a href={"https://api.whatsapp.com/send/?phone=" + process.env.REACT_CHATWOOT_NUMBER_PHONE} target="_blank">
                  por aqui
                </a>
                .
              </div>
            )}
            {msgWhats && (
              <div class="alert alert-success" role="alert">
                Sua solicitação foi realizada, em instantes você receberá a confirmação pelo seu Whats'app.
              </div>
            )}
            {inputError && (
              <div class="alert alert-danger" role="alert">
                Você precisa preencher todos os campos
              </div>
            )}
            <div>
              {type == "appointment" && !MsgAppointment && (
                <h4 class="text-center text-contact ">
                  Ao clicar no botão abaixo você entrará em nossa fila de agendamento de consulta e receberá uma mensagem de confirmação no seu Whats'app.
                  <br></br>
                  <br></br>Assim que chegar sua vez nossa equipe de acolhimento vai entrar em contato através do mesmo contato.
                </h4>
              )}

              {type == "appointment" && MsgAppointment && (
                <div>
                  <h2 class="text-center text-contact " style={{ color: "green" }}>
                    {" "}
                    Pronto! Você já está em nossa fila de agendamento de consulta. <br></br> <br></br>Assim que chegar sua vez nossa equipe de acolhimento vai entrar em contato através do Whats'app.
                    <br></br>
                    <br></br>
                    Se quiser, visite nosso blog e redes sociais enquanto aguarda.
                  </h2>
                  <div class="container">
                    <div class="row">
                      <div class="col-sm-4">
                        <div class="text-center">
                          <a href="https://www.instagram.com/associacaosantaguia" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 64 64">
                              <radialGradient id="TGwjmZMm2W~B4yrgup6jda_119026_gr1" cx="32" cy="32.5" r="31.259" gradientTransform="matrix(1 0 0 -1 0 64)" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="#efdcb1"></stop>
                                <stop offset="0" stop-color="#f2e0bb"></stop>
                                <stop offset=".011" stop-color="#f2e0bc"></stop>
                                <stop offset=".362" stop-color="#f9edd2"></stop>
                                <stop offset=".699" stop-color="#fef4df"></stop>
                                <stop offset="1" stop-color="#fff7e4"></stop>
                              </radialGradient>
                              <path fill="url(#TGwjmZMm2W~B4yrgup6jda_119026_gr1)" d="M58,54c-1.1,0-2-0.9-2-2s0.9-2,2-2h2.5c1.9,0,3.5-1.6,3.5-3.5S62.4,43,60.5,43H50c-1.4,0-2.5-1.1-2.5-2.5	S48.6,38,50,38h8c1.7,0,3-1.3,3-3s-1.3-3-3-3H42v-6h18c2.3,0,4.2-2,4-4.4c-0.2-2.1-2.1-3.6-4.2-3.6H58c-1.1,0-2-0.9-2-2s0.9-2,2-2	h0.4c1.3,0,2.5-0.9,2.6-2.2c0.2-1.5-1-2.8-2.5-2.8h-14C43.7,9,43,8.3,43,7.5S43.7,6,44.5,6h3.9c1.3,0,2.5-0.9,2.6-2.2	C51.1,2.3,50,1,48.5,1H15.6c-1.3,0-2.5,0.9-2.6,2.2C12.9,4.7,14,6,15.5,6H19c1.1,0,2,0.9,2,2s-0.9,2-2,2H6.2c-2.1,0-4,1.5-4.2,3.6	C1.8,16,3.7,18,6,18h2.5c1.9,0,3.5,1.6,3.5,3.5S10.4,25,8.5,25H5.2c-2.1,0-4,1.5-4.2,3.6C0.8,31,2.7,33,5,33h17v11H6	c-1.7,0-3,1.3-3,3s1.3,3,3,3l0,0c1.1,0,2,0.9,2,2s-0.9,2-2,2H4.2c-2.1,0-4,1.5-4.2,3.6C-0.2,60,1.7,62,4,62h53.8	c2.1,0,4-1.5,4.2-3.6C62.2,56,60.3,54,58,54z"></path>
                              <radialGradient id="TGwjmZMm2W~B4yrgup6jdb_119026_gr2" cx="18.51" cy="66.293" r="69.648" gradientTransform="matrix(.6435 -.7654 .5056 .4251 -26.92 52.282)" gradientUnits="userSpaceOnUse">
                                <stop offset=".073" stop-color="#eacc7b"></stop>
                                <stop offset=".184" stop-color="#ecaa59"></stop>
                                <stop offset=".307" stop-color="#ef802e"></stop>
                                <stop offset=".358" stop-color="#ef6d3a"></stop>
                                <stop offset=".46" stop-color="#f04b50"></stop>
                                <stop offset=".516" stop-color="#f03e58"></stop>
                                <stop offset=".689" stop-color="#db359e"></stop>
                                <stop offset=".724" stop-color="#ce37a4"></stop>
                                <stop offset=".789" stop-color="#ac3cb4"></stop>
                                <stop offset=".877" stop-color="#7544cf"></stop>
                                <stop offset=".98" stop-color="#2b4ff2"></stop>
                              </radialGradient>
                              <path fill="url(#TGwjmZMm2W~B4yrgup6jdb_119026_gr2)" d="M45,57H19c-5.5,0-10-4.5-10-10V21c0-5.5,4.5-10,10-10h26c5.5,0,10,4.5,10,10v26C55,52.5,50.5,57,45,57z"></path>
                              <path
                                fill="#fff"
                                d="M32,20c4.6,0,5.1,0,6.9,0.1c1.7,0.1,2.6,0.4,3.2,0.6c0.8,0.3,1.4,0.7,2,1.3c0.6,0.6,1,1.2,1.3,2 c0.2,0.6,0.5,1.5,0.6,3.2C46,28.9,46,29.4,46,34s0,5.1-0.1,6.9c-0.1,1.7-0.4,2.6-0.6,3.2c-0.3,0.8-0.7,1.4-1.3,2 c-0.6,0.6-1.2,1-2,1.3c-0.6,0.2-1.5,0.5-3.2,0.6C37.1,48,36.6,48,32,48s-5.1,0-6.9-0.1c-1.7-0.1-2.6-0.4-3.2-0.6 c-0.8-0.3-1.4-0.7-2-1.3c-0.6-0.6-1-1.2-1.3-2c-0.2-0.6-0.5-1.5-0.6-3.2C18,39.1,18,38.6,18,34s0-5.1,0.1-6.9 c0.1-1.7,0.4-2.6,0.6-3.2c0.3-0.8,0.7-1.4,1.3-2c0.6-0.6,1.2-1,2-1.3c0.6-0.2,1.5-0.5,3.2-0.6C26.9,20,27.4,20,32,20 M32,17 c-4.6,0-5.2,0-7,0.1c-1.8,0.1-3,0.4-4.1,0.8c-1.1,0.4-2.1,1-3,2s-1.5,1.9-2,3c-0.4,1.1-0.7,2.3-0.8,4.1C15,28.8,15,29.4,15,34 s0,5.2,0.1,7c0.1,1.8,0.4,3,0.8,4.1c0.4,1.1,1,2.1,2,3c0.9,0.9,1.9,1.5,3,2c1.1,0.4,2.3,0.7,4.1,0.8c1.8,0.1,2.4,0.1,7,0.1 s5.2,0,7-0.1c1.8-0.1,3-0.4,4.1-0.8c1.1-0.4,2.1-1,3-2c0.9-0.9,1.5-1.9,2-3c0.4-1.1,0.7-2.3,0.8-4.1c0.1-1.8,0.1-2.4,0.1-7 s0-5.2-0.1-7c-0.1-1.8-0.4-3-0.8-4.1c-0.4-1.1-1-2.1-2-3s-1.9-1.5-3-2c-1.1-0.4-2.3-0.7-4.1-0.8C37.2,17,36.6,17,32,17L32,17z"
                              ></path>
                              <path fill="#fff" d="M32,25c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S37,25,32,25z M32,40c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S35.3,40,32,40 z"></path>
                              <circle cx="41" cy="25" r="2" fill="#fff"></circle>
                            </svg>
                          </a>
                        </div>
                        <div class="text-center" style={{ fontWeight: "bold" }}>
                          Instagram
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="text-center">
                          <a href="https://santaguia.org.br" target="_blank">
                            <img width="50" height="50" src="https://img.icons8.com/plasticine/50/domain.png" alt="domain" />
                          </a>
                        </div>
                        <div class="text-center" style={{ fontWeight: "bold" }}>
                          Site
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="text-center">
                          <a href="https://www.youtube.com/channel/UCWNqXEd52qCnv5ii0U4y2Fw" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                              <path fill="#455A64" d="M14.539 6h2.125l1.37 5.496h.133l1.308-5.493h2.147l-2.458 8.036V20h-2.112v-5.703L14.539 6zM21.525 11.923c0-.784.254-1.411.759-1.874.504-.466 1.182-.7 2.035-.7.778 0 1.413.245 1.908.737.495.488.743 1.121.743 1.894v5.235c0 .866-.242 1.548-.728 2.044C25.756 19.753 25.09 20 24.235 20c-.823 0-1.477-.259-1.974-.767-.493-.508-.738-1.194-.738-2.055v-5.256H21.525zM23.455 17.368c0 .275.066.494.205.646.132.15.322.226.571.226.255 0 .454-.077.604-.234.149-.151.226-.366.226-.638v-5.522c0-.22-.079-.399-.231-.536-.151-.135-.352-.205-.599-.205-.229 0-.417.07-.561.205-.143.137-.215.316-.215.536V17.368zM33.918 9.605V20h-1.875v-1.266c-.346.414-.705.728-1.081.941C30.59 19.89 30.227 20 29.876 20c-.435 0-.76-.149-.981-.452-.221-.3-.329-.751-.329-1.357V9.605h1.874v7.886c0 .236.04.41.12.519.075.104.207.162.38.162.141 0 .315-.071.522-.215.213-.141.406-.324.581-.544V9.605H33.918z"></path>
                              <path fill="#FFF" d="M38.799,26.439c0-2.342-1.94-4.24-4.329-4.24c-3.412-0.143-6.905-0.203-10.47-0.198c-3.563-0.005-7.056,0.056-10.47,0.198c-2.387,0-4.327,1.898-4.327,4.24C9.061,28.291,8.995,30.145,9,32.001c-0.005,1.853,0.06,3.707,0.204,5.561c0,2.345,1.938,4.243,4.326,4.243c3.414,0.14,6.907,0.2,10.47,0.195c3.564,0.008,7.058-0.056,10.47-0.195c2.389,0,4.329-1.898,4.329-4.243c0.142-1.854,0.209-3.708,0.201-5.561C39.008,30.145,38.941,28.291,38.799,26.439z"></path>
                              <g>
                                <path fill="#F44336" d="M33.851 30.346c-.219 0-.368.058-.458.18-.064.091-.145.299-.145.752v.774h1.193v-.774c0-.446-.083-.655-.151-.757C34.205 30.402 34.061 30.346 33.851 30.346zM26.865 30.386c-.086.042-.17.105-.258.193v5.876c.11.111.217.191.316.242.111.055.224.08.346.08.231 0 .303-.091.326-.123.057-.071.119-.219.119-.54v-5.005c0-.278-.053-.493-.152-.625C27.428 30.306 27.164 30.236 26.865 30.386z"></path>
                                <path
                                  fill="#F44336"
                                  d="M38.799,26.439c0-2.342-1.94-4.24-4.329-4.24c-3.412-0.143-6.905-0.203-10.47-0.198c-3.563-0.005-7.056,0.056-10.47,0.198c-2.387,0-4.327,1.898-4.327,4.24C9.061,28.291,8.995,30.145,9,32.001c-0.005,1.853,0.06,3.707,0.204,5.561c0,2.345,1.938,4.243,4.326,4.243c3.414,0.14,6.907,0.2,10.47,0.195c3.564,0.008,7.058-0.056,10.47-0.195c2.389,0,4.329-1.898,4.329-4.243c0.142-1.854,0.209-3.708,0.201-5.561C39.008,30.145,38.941,28.291,38.799,26.439z M15.701,38.382c0,0.111-0.092,0.204-0.206,0.204h-2.049c-0.114,0-0.206-0.093-0.206-0.204v-11.03h-1.914c-0.113,0-0.205-0.092-0.205-0.203v-1.904c0-0.112,0.092-0.204,0.205-0.204h6.291c0.114,0,0.206,0.092,0.206,0.204v1.904c0,0.111-0.091,0.203-0.206,0.203h-1.916V38.382z M22.995,38.382c0,0.111-0.092,0.204-0.206,0.204h-1.822c-0.114,0-0.206-0.093-0.206-0.204v-0.551c-0.243,0.233-0.486,0.418-0.738,0.56c-0.397,0.227-0.776,0.336-1.16,0.336c-0.488,0-0.864-0.176-1.117-0.517c-0.238-0.324-0.361-0.803-0.361-1.421v-8.1c0-0.112,0.092-0.204,0.207-0.204h1.821c0.114,0,0.206,0.092,0.206,0.204v7.428c0,0.244,0.044,0.343,0.072,0.382c0.013,0.017,0.05,0.067,0.205,0.067c0.052,0,0.172-0.022,0.389-0.169c0.176-0.115,0.334-0.259,0.473-0.425v-7.283c0-0.112,0.092-0.204,0.207-0.204h1.821c0.114,0,0.206,0.092,0.206,0.204v9.692H22.995z M30,36.373c0,0.736-0.159,1.31-0.473,1.708c-0.326,0.418-0.797,0.626-1.398,0.626c-0.383,0-0.733-0.077-1.046-0.233c-0.166-0.083-0.327-0.191-0.479-0.325v0.233c0,0.114-0.093,0.204-0.206,0.204h-1.837c-0.114,0-0.207-0.09-0.207-0.204v-13.14c0-0.112,0.092-0.203,0.207-0.203h1.837c0.113,0,0.206,0.091,0.206,0.203v3.717c0.15-0.136,0.31-0.25,0.474-0.343c0.309-0.17,0.625-0.256,0.941-0.256c0.641,0,1.143,0.238,1.484,0.706c0.328,0.45,0.495,1.101,0.495,1.933L30,36.373L30,36.373z M36.729,33.765c0,0.113-0.093,0.205-0.207,0.205h-3.273v1.621c0,0.592,0.082,0.845,0.148,0.951c0.053,0.088,0.152,0.199,0.438,0.199c0.23,0,0.388-0.055,0.469-0.164c0.037-0.058,0.139-0.28,0.139-0.988v-0.675c0-0.114,0.093-0.204,0.207-0.204h1.872c0.114,0,0.205,0.09,0.205,0.204v0.729c0,1.044-0.249,1.844-0.737,2.384c-0.49,0.543-1.23,0.82-2.198,0.82c-0.872,0-1.574-0.296-2.079-0.871c-0.5-0.571-0.755-1.354-0.755-2.333v-4.352c0-0.892,0.278-1.63,0.83-2.196c0.55-0.568,1.274-0.857,2.144-0.857c0.89,0,1.587,0.271,2.072,0.803c0.48,0.526,0.724,1.284,0.724,2.251v2.474H36.729z"
                                ></path>
                              </g>
                            </svg>
                          </a>
                        </div>
                        <div class="text-center" style={{ fontWeight: "bold" }}>
                          Youtube
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {type != "appointment" && (
                <div>
                  <h4 class="text-center text-contact "> Para solicitar contato, clique no botão abaixo, você receberá uma mensagem no seu número de Whats'app.</h4>
                  <label style={{ color: "black" }} className="form-label">
                    Escreva aqui sua mensagem
                  </label>
                  <textarea name="message" className="form-control" onBlur={handleChangeInput} onChange={handleChangeInput} />
                </div>
              )}
            </div>
            <br></br>
            {type == "appointment" && (
              <div class="container d-flex justify-content-center align-items-center">
                <button hidden={MsgAppointment} class="btn btn-primary btn-lg" type="submit" onClick={contact}>
                  Solicitar agendamento{" "}
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
                    <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
                    <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
                    <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
                    <path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            )}

            {type != "appointment" && (
              <div class="container d-flex justify-content-center align-items-center">
                <button class="btn btn-primary btn-lg" type="submit" onClick={contact}>
                  Solicitar contato{" "}
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
                    <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
                    <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
                    <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
                    <path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            )}
          </form>
        </Modal.Body>
      </Modal>
      {type == "appointment" && <input onClick={openModal} type="radio" className="btn-check" name="resposable" id="btnradio2" value="no"></input>}

      {type != "appointment" && (
        <a onClick={openModal} class="text-left text-white btn btn-warning btn-contact">
          Solicitar contato{" "}
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
            <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
            <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
            <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
            <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
            <path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
          </svg>
        </a>
      )}
    </div>
  );
};

export default Contact;
