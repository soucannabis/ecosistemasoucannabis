import { BrowserRouter as Router, Route, Routes, Navigate, Link, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LoginForm from "./components/pages/loginForm";
import ApproveAssociate from "./components/pages/approveAssociate";
import Contact from "./components/pages/first-contact";
import Menu from "./components/pages/elements/menu";
import MenuMobile from "./components/pages/elements/menu-mobile";
import AssociateSignup from "./components/pages/associate-signup";
import PatientSignup from "./components/pages/patient-signup";
import Sidebar from "./components/pages/elements/sidebar";
import TopBarMobile from "./components/pages/elements/topBarMobile";
import Signup from "./components/pages/signup";
import SignupEmail from "./components/pages/signup-email";
import UploadComponent from "./components/pages/documents-upload";
import Home from "./components/pages/home";
import MedicalAppointment from "./components/pages/medical-appointment";
import Prescription from "./components/pages/prescription";
import PrescriptionAppointment from "./components/pages/prescription-appointment";
import Welcome from "./components/pages/welcome";
import LostPass from "./components/pages/lost-password";
import User from "./modules/User";
import Products from "./components/pages/shop/products";
import "./styles/general.css";
import backgroundImage from './images/background.jpg'
import { Dropdown } from 'react-bootstrap';

function App() {
  const [user, setUser] = useState(false);
  const [userCode, setUserCode] = useState(false);
  const [hiddenButtons, setHiddenButtons] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hiddenLogin, setHiddenLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();

    if (localStorage.getItem("user_code")) {
      setUserCode(localStorage.getItem("user_code"));
    } else {
      setHiddenButtons(false);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const url = window.location.href;
    var page = url.split("/");
    page = page[3].split("?");
    page = page[0];

    if (page == "nova-senha" || page == "iniciar-cadastro") {
      setHiddenLogin(true);
    }
  }, []);

  if (loading) {
    return (
      <div class="container vertical-center">
        <img src="logo.svg" width="5%" class="logo-load" />
        <p class="loading-text">carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      {hiddenLogin && (
        <div>
          <Routes>
            <Route path="/iniciar-cadastro" element={<SignupEmail />} />
          </Routes>
          <div class="container vertical-center">
            <div class="text-center login-div">
              <Routes>
                <Route path="/nova-senha" element={<LostPass />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
      {!user && (
        <div>
          {window.innerWidth > 600 && (
            <div class="container vertical-center" hidden={hiddenLogin}>
              <div class="text-center login-div">
                <img
                  src="logo.png"
                />
                <h1 class="sub-title"><b>Cadastramento Programa Mãe Maria</b></h1>
                <br></br>
                <div class="row">                
                  <Link to="/cadastro" class="btn btn-lg btn-success" hidden={hiddenButtons}>
                    Criar minha conta
                  </Link>
                  <Link to="/login" class="btn btn-lg btn-primary btn-login" hidden={hiddenButtons}>
                    Login
                  </Link>
                </div>
              </div>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/cadastro" element={<Signup />} />
              </Routes>
            </div>
          )}

          {window.innerWidth < 600 && (
            <div class="container mobile-login" hidden={hiddenLogin}>
              <div class="text-center">
                <img
                  src="/logo.png"
                  width="40%"
                />
                <h1 class="sub-title">Cadastramento Programa Mãe Maria</h1>
                <div class="row">                  
                  <Link to="/cadastro" class="btn btn-lg btn-success" hidden={hiddenButtons}>
                    Criar minha conta
                  </Link>
                  <Link to="/login" class="btn btn-lg btn-primary btn-login" hidden={hiddenButtons}>
                    Login
                  </Link>
                </div>
              </div>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/cadastro" element={<Signup />} />
              </Routes>
            </div>
          )}
        </div>

      )}


      {user && (
        <div>
          {window.innerWidth > 600 && (
            <div class="wrapper">
              <span>
                <Menu />
              </span>
              <div class="sidebar">
                <Sidebar />
              </div>
              <div class="content">
                <Routes>
                  <Route path="/" element={<Home />} />,
                  <Route path="/bem-vindo" element={<Welcome />} />
                  <Route path="/solicitacao-contato" element={<Contact />} />
                  <Route path="/cadastro-associado" element={<AssociateSignup />} />
                  <Route path="/cadastro-paciente" element={<PatientSignup />} />
                  <Route path="/documentos" element={<UploadComponent />} />
                  <Route path="/consulta" element={<MedicalAppointment />} />
                  <Route path="/receita-medica" element={<Prescription />} />
                  <Route path="/receita-medica-agendamento" element={<PrescriptionAppointment />} /> <Route path="/cadastro" element={<ApproveAssociate />} />
                </Routes>
              </div>
            </div>
          )}

          {window.innerWidth < 600 && (

            <div class="wrapper">
              <MenuMobile />
              <TopBarMobile />
              <div class="">
                <Routes>
                  <Route path="/" element={<Home />} />,
                  <Route path="/bem-vindo" element={<Welcome />} />
                  <Route path="/solicitacao-contato" element={<Contact />} />
                  <Route path="/cadastro-associado" element={<AssociateSignup />} />
                  <Route path="/cadastro-paciente" element={<PatientSignup />} />
                  <Route path="/documentos" element={<UploadComponent />} />
                  <Route path="/consulta" element={<MedicalAppointment />} />
                  <Route path="/receita-medica" element={<Prescription />} />
                  <Route path="/receita-medica-agendamento" element={<PrescriptionAppointment />} />
                  <Route path="/cadastro" element={<ApproveAssociate />} />
                </Routes>
              </div>
            </div>
          )}
        </div>
      )}
      <Routes>
        <Route path="/loja" element={<Products />} />
        <Route path="/seu-cadastro" element={<SignupEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
