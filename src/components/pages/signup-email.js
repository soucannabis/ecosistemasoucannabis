import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import directusRequest from "../../modules/apiRequest";
import apiRequest from "../../modules/apiRequest";
import User from "../../modules/User";

function SignupEmail() {
  const [emailInput, setEmailInput] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();

    const timer = setTimeout(() => {}, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (user.responsable_type == "another" && user.resposible_for == null) {
    window.location.assign("/cadastro-paciente");
  }

  if (user.associate_status == 0) {
    window.location.assign("/bem-vindo");
  }
  if (user.associate_status == 1) {
    window.location.assign("/cadastro-associado");
  }

  if (user.associate_status == 2) {
    window.location.assign("/cadastro-associado");
  }

  if (user.associate_status == 3 && user.responsable_type == "another" && user.resposible_for == null) {
    window.location.assign("/cadastro-paciente");
  } else if (user.associate_status == 3) {
    window.location.assign("/documentos");
  }

  if (user.associate_status == 4) {
    window.location.assign("/consulta");
  }
  if (user.associate_status == 5) {
    window.location.assign("/cadastro");
  }
  if (user.associate_status >= 6) {
    window.location.assign("/cadastro");
  }

  const signUp = async event => {
    event.preventDefault();
    const validateEmail = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailInput);

    if (!validateEmail) {
      const serchEmail = await apiRequest("/api/directus/search", { query: "/items/Users?filter[email_account][_eq]=" + emailInput }, "POST");
      console.log(serchEmail);
      if (serchEmail) {
        setErrorEmail(true);
      } else {
        const userData = await apiRequest("/api/directus/create-user", { email_account: emailInput, associate_status: 0 }, "POST");
        localStorage.setItem("user_code", await userData.user_code);
        if (userData) {
          window.location.assign("/bem-vindo");
        }
      }
    } else {
      setEmailValidate(true);
      setTimeout(() => {
        setEmailValidate(false);
      }, 5000);
    }
  };

  const emailHandleChange = event => {
    setEmailInput(event.target.value);
  };

  return (
    <div class="container">
      <div class="row justify-content-center">
        <img class="logo" src={import.meta.env.VITE_ASSOCIATION_LOGO}></img>
      </div>
      <h1 class="title" style={{ marginTop: "30px" }}>
        Cadastro de associado
      </h1>
      <div class="row justify-content-center">
        <div class="col-md-6 form-signup">
          {errorEmail && (
            <div className="alert alert-danger" role="alert">
              Este endereço de e-mail já está sendo usado. Se você ja se preencheu seus dados, por favor, <a href="/login">FAÇA LOGIN AQUI</a>
            </div>
          )}
          {emailValidate && (
            <div className="alert alert-danger" role="alert">
              Endereço de e-mail inválido
            </div>
          )}

          <h1 class="sub-title">Preencha seu e-mail abaixo para iniciar seu cadastro de associado.</h1>
          <form onSubmit={signUp}>
            <div class="form-group">
              <input type="email" class="form-input input-login" onChange={emailHandleChange} value={emailInput} id="email" placeholder="Digite seu email"></input>
            </div>
            <br />
            <a href="/login" style={{color:"white", fontSize:"17px"}} className="btn">
              Fazer login
            </a>
            <button type="submit" className="btn btn-primary btn-lg btn-signup">
              Iniciar cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupEmail;
