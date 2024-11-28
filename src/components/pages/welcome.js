import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";

function Welcome() {

  return (
    
    <div class="container">
         <div className="homepage">
            <div>
                <h1 class="title"> Olá, é um prazer receber você <br></br> {import.meta.env.VITE_WELCOME_TEXT}</h1>
                <br></br>
                <h2 style={{textAlign:"center"}}>Siga todos os passos deste guia para se associar e contar com os benefícios da associação.</h2>
                <h2 style={{textAlign:"center"}}>Você precisará informar seus dados pessoais, foto de documentos de identidade e comprovante de residência.</h2>
                <h2 style={{textAlign:"center"}}>Se você tiver dúvidas e precisar de ajuda, clique no botão <br></br><b style={{color:"orange"}}>"Solicitar Contato"</b> no menu.</h2>
                <div class="container d-flex justify-content-center align-items-center">
                    <Link to="/cadastro-associado" class="btn btn-lg btn-primary btn-login" >Iniciar Cadastro</Link>
                    <br></br>
                </div>
            </div></div>
     
        </div>
  );
}

export default Welcome;
