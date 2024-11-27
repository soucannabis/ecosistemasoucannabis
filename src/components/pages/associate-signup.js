import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import apiRequest from "../../modules/apiRequest";
import User from "../../modules/User";
import GenderInput from "../forms/GenderInput";
import NationalityInput from "../forms/NationalityInput";
import LabelInfo from "../pages/elements/labelInfo";
import AlertError from "../forms/AlertError";
import MultiSelectField from "../forms/CIAPInput";
import Modal from "react-bootstrap/Modal";
import PhoneInputs from "../forms/PhoneNumberInput";
import ReasonTreatment from "../forms/ReasonTreatment";
import Ciap2Select from "../forms/CIAP2Select";

const AssociateSignUp = () => {
  const [user, setUser] = useState({});
  const [inputError, setInputError] = useState(false);
  const [fieldsError, setFieldsError] = useState(false);
  const [validateForm, setValidateForm] = useState();
  const [cpfError, setCpfError] = useState(false);
  const [cpfNotValid, setCpfNotValid] = useState(false);
  const [cepError, setcepError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const handleClose = () => setShowPopup(false);
  const handleShow = () => setShowPopup(true);
  const [passError, setPassError] = useState(false);
  const [ciapError, setCiapError] = useState(false);
  const [formData, setFormData] = useState({
    responsable_type: null,
    name_associate: null,
    lastname_associate: null,
    birthday_associate: null,
    gender: null,
    nationality: null,
    cpf_associate: null,
    rg_associate: null,
    emiiter_rg_associate: null,
    marital_status: null,
    street: null,
    number: null,
    complement: null,
    neighborhood: null,
    city: null,
    state: null,
    cep: null,
    reason_treatment: null,
    mobile_number: null,
    reason_treatment_text: null,
    associate_status: 3,
    pass_account: null,
    met_us:null
  });
  const [counterTratmentOptions, setCounterTratment] = useState(false);
  const [counterCheck, setCounterCheck] = useState(false);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState("");

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();

    const timer = setTimeout(() => { }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (formData.reason_treatment && formData.reason_treatment.length > 10) {
      setCounterCheck(true)
    } else {
      setCounterCheck(false)
    }

  }, [formData]);

  if (user.associate_status > 3) {
    window.location.assign("/");
  }

  const [phone, setPhone] = useState("");

  const handleOnChange = (value, country) => {
    setPhone(value);
  };

  const handleChangeInput = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectionChange = event => {
    setFormData({
      ...formData,
      ["reason_treatment"]: event,
    });
  };

  function counter() {
    setCounterTratment(true)
  }

  const handleChangeInputPhone = event => {
    setFormData({
      ...formData,
      ["mobile_number"]: event,
    });
    setInputError(false);
  };
  const handleChoice = choice => {
    handleClose();
  };

  const responsable_himself = event => {
    var responsableType = event.target.value;
    setFormData({ ...formData, responsable_type: responsableType });
  };

  const responsable_another = event => {
    var responsableType = event.target.value;
    setFormData({ ...formData, responsable_type: responsableType });
  };

  const responsable_pet = event => {
    var responsableType = event.target.value;
    setFormData({ ...formData, responsable_type: responsableType });
  };

  const statesData = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

  const updateUser = async event => {
    event.preventDefault();

    var emptyFields = [];
    var fieldsNames = []

    for (let key in formData) {

      if (formData.hasOwnProperty(key)) {
        if (formData[key] == null || formData[key] == undefined || formData[key] == "" || formData[key] == []) {
          if (key != "complement") {
            emptyFields.push(key);
            fieldsNames.push(key);
          }
          if (key != "mobile_number" && key != "status" && key != "associate_status" && key != "reason_treatment" && key != "complement" && key != "log") {
            document.querySelector("#" + key).className = "form-input input-login input-empty";
          }
        } else {
          if (key != "mobile_number" && key != "status" && key != "associate_status" && key != "reason_treatment" && key != "complement" && key != "log") {
            document.querySelector("#" + key).className = "form-input input-login";
          }
        }

        if (!formData.reason_treatment || formData.reason_treatment.length < 1) {
          document.querySelector(".select-treatment").className = "form-input input-login select-treatment input-empty";
        } else {
          document.querySelector(".select-treatment").className = "select-treatment form-input input-login";
        }
      }
    }

    const translations = {
      responsable_type: "Tipo de responsável",
      name_associate: "Nome do associado",
      lastname_associate: "Sobrenome do associado",
      birthday_associate: "Data de nascimento",
      gender: "Gênero",
      nationality: "Nacionalidade",
      cpf_associate: "CPF",
      rg_associate: "RG",
      emiiter_rg_associate: "Órgão emissor",
      marital_status: "Estado civil",
      mobile_number: "Número de celular",
      pass_account: "Senha da conta",
      street: "Rua",
      number: "Número",
      neighborhood: "Bairro",
      city: "Cidade",
      state: "Estado",
      cep: "CEP",
      reason_treatment: "Motivo do tratamento",
      reason_treatment_text: "Motivo do tratamento com suas palavras",
      met_us:"Como nos conheceu"
    };

    let translatedFields = [];

    fieldsNames.map(field => {
      if (translations[field]) {
        translatedFields.push(translations[field]);
      }
    });

    let translatedFieldsString = translatedFields.join(", ");

    setEmptyFieldsMessage(translatedFieldsString)

    if (emptyFields != []) {
      setValidateForm(true);
    } else {
      setValidateForm(false);
    }

    const validateCPF = formData.cpf_associate;
    if (validateCPF && validateCPF.includes("_")) {
      setCpfError(true);
      setTimeout(() => {
        setCpfError(false);
      }, 6000);

      emptyFields.push("cpf");
    } else {
      function realCPF(cpf) {
        if (formData.cpf_associate) {
          cpf = cpf.replace(/[^\d]+/g, "");
          if (cpf.length !== 11) return false;

          let soma = 0;
          for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
          }
          let resto = 11 - (soma % 11);
          let digito1 = resto === 10 || resto === 11 ? 0 : resto;

          soma = 0;
          for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
          }
          resto = 11 - (soma % 11);
          let digito2 = resto === 10 || resto === 11 ? 0 : resto;

          return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
        }
      }

      if (!realCPF(validateCPF)) {
        if (formData.cpf_associate) {
          emptyFields.push("cpf");
          setCpfNotValid(true);
          setTimeout(() => {
            setCpfNotValid(false);
          }, 6000);
        }
      }
    }

    const pass = formData.pass_account
    if (formData.pass_account && pass.length <= 5) {
      setPassError(true)
      setTimeout(() => {
        setPassError(false);
      }, 6000);

      emptyFields.push("pass");
    }

    setFieldsError(true);
    setTimeout(() => {
      setFieldsError(false);
    }, 6000);

    if (emptyFields == "" || emptyFields == []) {
      setFieldsError(false);
      formData.status = "registered"
      formData.log = "Registered OK"
      if (formData.reason_treatment && formData.reason_treatment.length > 10) {
        setCiapError(true)
        setTimeout(() => {
          setCiapError(false);
        }, 6000);
      } else {
        await apiRequest("/api/directus/update", { userId: user.id, formData: formData }, "POST")
          .then(response => { })
          .catch(error => {
            console.error(error);
          });

        if (formData.responsable_type == "another") {
          window.location.assign("/cadastro-paciente");
        } else {
          window.location.assign("/documentos");
        }
      }
    } else {
      await apiRequest("/api/directus/update", { userId: user.id, formData: { status: "formerror", log: { "formError": { "emptyFields": emptyFields } } } }, "POST")
    }
  };

  function scrollDown() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  return (
    <div>
      {console.log(counterTratmentOptions)}
      {counterTratmentOptions &&
        <div class="fixed-div" style={!counterCheck ? ({ backgroundColor: "" }) : ({ backgroundColor: "red", color: "white" })}>
          <div style={{ textAlign: "center" }}>Você pode selecionar até <b>10</b> motivos
            {formData.reason_treatment ? (
              <h5 style={{ marginTop: "7px" }}>{formData.reason_treatment.length}/10</h5>
            ) : (
              <h5>0/10</h5>
            )}
            <a class="btn btn-primary btn-sm" onClick={scrollDown}>
              Continuar  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
              </svg>
            </a>
          </div>
        </div>
      }


      <form onSubmit={updateUser} className="form-container ">
        <h1>Você é responsável pelo seu próprio tratamento?</h1>
        <br></br>

        <div className="form-input input-login" id="responsable_type">
          <input type="radio" className="btn-check" onClick={responsable_himself} name="resposable" id="btnradio1" value="himself"></input>
          <label className="btn btn-outline-primary radio-input" htmlFor="btnradio1">
            Sim, sou responsável pelo MEU PRÓPRIO tratamento
          </label>
          <input type="radio" className="btn-check" onClick={responsable_another} name="resposable" id="btnradio2" value="another"></input>
          <label className="btn btn-outline-primary radio-input" htmlFor="btnradio2">
            Sou responsável pelo tratamento de OUTRA PESSOA
          </label>
          <input type="radio" className="btn-check" onClick={responsable_pet} name="resposable" id="btnradio3" value="pet"></input>
          <label className="btn btn-outline-primary radio-input" htmlFor="btnradio3">
            Sou responsável por um PET
          </label>
        </div>

        <br></br>
        <div>
          <div className="mb-3">
            <label className="form-label" htmlFor="name_associate">
              Primeiro nome
            </label>
            <input class="form-input input-login" placeholder="Digite seu primeiro nome" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.name_associate} type="text" id="name_associate" name="name_associate"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="lastname_associate">
              Sobrenome
            </label>
            <input class="form-input input-login" placeholder="Digite seu sobrenome" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.lastname_associate} type="text" id="lastname_associate" name="lastname_associate"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="birthday_associate">
              Data de nascimento
            </label>
            <InputMask mask="99/99/9999" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.birthday_associate} type="text" id="birthday_associate" name="birthday_associate">
              {inputProps => <input placeholder="__/__/____" class="form-input input-login" {...inputProps} />}
            </InputMask>

          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="gender">
              Identidade de gênero <LabelInfo message="Escolha o gênero ou digite com qual você se identifica" id="gen" />
            </label>
            <GenderInput className="form-input" name="gender" handleChangeInput={handleChangeInput} />
          </div>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="nationality">
              Nacionalidade <LabelInfo message="Escolha o país onde nasceu" id="nac" />
            </label>
            <NationalityInput name="nacionality" handleChangeInput={handleChangeInput} />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="cpf_associate">
              CPF <LabelInfo message="Necessário para a geração doo termo de responsabilidade do associado" id="cpf" />
            </label>
            <InputMask mask="999.999.999-99" value={formData.cpf_associate} onChange={handleChangeInput} onBlur={handleChangeInput}>
              {inputProps => <input placeholder="Digite seu CPF" type="text" value={formData.cpf_associate} id="cpf_associate" name="cpf_associate" className="form-input" {...inputProps} />}
            </InputMask>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="rg_associate">
              RG <LabelInfo message="Necessário para a geração doo termo de responsabilidade do associado" id="rg" />
            </label>
            <input placeholder="Digite seu RG" type="text" value={formData.rg_associate} id="rg_associate" name="rg_associate" className="form-input" onChange={handleChangeInput} />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="emiiter_rg_associate">
              Orgão emissor <LabelInfo message="Informe o orgão emissor do seu rg" id="org" />
            </label>
            <input placeholder="Digite o orgão emissor do seu RG" class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.emiiter_rg_associate} type="text" id="emiiter_rg_associate" name="emiiter_rg_associate"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="marital_status">
              Estado civil
            </label>
            <select class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.marital_status} type="text" id="marital_status" name="marital_status">
              <option value="">Selecione...</option>
              <option value="Solteiro">Solteiro(a)</option>
              <option value="Casado">Casado(a)</option>
              <option value="União-Estável">União Estável</option>
              <option value="Viúvo">Viúvo(a)</option>
              <option value="Divorciado">Divorciado(a)</option>
            </select>
          </div>
          <br></br>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Defina uma senha para sua conta <LabelInfo message="Criar uma senha é necessário para poder acessar o sistema novamente e poder editar seus dados" id="pass" />
            </label>
            <input placeholder="Digite uma senha para sua conta" class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.pass_account} type="password" id="pass_account" name="pass_account"></input>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Telefone
            </label>
            <PhoneInputs id="mobile_number" value={formData.mobile_number} onChange={handleChangeInputPhone} onBlur={handleChangeInputPhone} handleChangeInput={handleChangeInputPhone} name="mobile_number" />
          </div>
          <br></br>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="street">
              Rua
            </label>
            <input placeholder="Digite o nome da sua rua" class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.street} type="text" id="street" name="street"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="number">
              Número
            </label>
            <input placeholder="Digite o número da sua casa ou ap" class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.number} type="text" id="number" name="number"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="complement">
              Complemento
            </label>
            <input placeholder="Digite um complemento para seu endereço" class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.complement} type="text" id="complement" name="complement"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="neighborhood">
              Bairro
            </label>
            <input placeholder="Digite seu bairro" class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.neighborhood} type="text" id="neighborhood" name="neighborhood"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="city">
              Cidade
            </label>
            <input placeholder="Digite sua cidade" class="form-input input-login" onChange={handleChangeInput} value={formData.city} type="text" id="city" name="city"></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="state">
              Estado
            </label>
            <select class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.state} type="text" id="state" name="state">
              <option value="">Selecione...</option>
              {statesData.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
          <label className="form-label" htmlFor="cep">
            CEP
          </label>
          <div className="mb-3">
            <InputMask mask="99999-999" value={formData.cep} onChange={handleChangeInput} onBlur={handleChangeInput}>
              {inputProps => <input placeholder="Informe seu CEP" class="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.cep} type="text" id="cep" name="cep" {...inputProps} />}
            </InputMask>
          </div>
          <br></br>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="reason_treatment">
              Motivo principal para o tratamento
            </label>
            <p style={{ color: "#fff", fontStyle: "italic" }}>Os dados deste campo são de acordo com o CIAP2 (Classificação Internacional de Atenção Primária) <a style={{ color: "#fff", fontWeight: "bold" }} href="https://saude.campinas.sp.gov.br/sistemas/esus/guia_CIAP2.pdf" target="_blank">Saiba Mais</a></p>
            <p style={{ color: "#fff", fontStyle: "italic" }}>No campo abaixo, pesquise pelo motivo do tratamento e selecione uma ou mais opções.</p>
            <Ciap2Select handleChange={handleSelectionChange} id="reason_treatment" class="form-input input-login select-treatment" value={formData.reason_treatment} name="reason_treatment" counterCheck={counter} />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="reason_treatment_text">
              Descreva com suas palavras o motivo do seu tratamento <LabelInfo message="Informe com suas palavras os motivos do seu tratamento" id="trattxt" />
            </label>
            <textarea onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.reason_treatment_text} id="reason_treatment_text" name="reason_treatment_text" />
          </div>

          <div>
            <label class="form-label">Como você conheceu a SouCannabis?</label>
            <select className="form-input input-login"  id="met_us" name="met_us" onChange={handleChangeInput} onBlur={handleChangeInput} >
              <option value="Outra">Selecione...</option>
              <option value="Indicação de profissionais">Indicação de profissionais</option>
              <option value="Indicação de amigos ou familiares">Indicação de amigos ou familiares</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="Busca no google">Busca no Google</option>
              <option value="Outra">Outra</option>
            </select>
          </div>
          <br></br>
          <br></br>
          <button class="btn btn-success btn-lg btn-float-right" type="submit">
            Enviar dados
          </button>
          <br></br>
          <br></br>
          <br></br>
        </div>

        {fieldsError && <AlertError message="Você precisa preencher os seguintes campos: " emptyFields={emptyFieldsMessage} />}
        {ciapError && (
          <div class="alert2">
            <AlertError message="Você marcou mais que 10 motivos para seu tratamento." />
          </div>
        )}
        {cpfError && (
          <div class="alert2">
            <AlertError message="O CPF precisa estar completo" />
          </div>
        )}
        {cepError && (
          <div class="alert3">
            <AlertError message="O CEP está incompleto" />
          </div>
        )}
        {cpfNotValid && (
          <div class="alert3">
            <AlertError message="O CPF digitado não é válido" />
          </div>
        )}
        {passError && (
          <div class="alert3">
            <AlertError message="A senha precisa ter pelo menos 6 dígitos" />
          </div>
        )}
      </form>
    </div>
  );
};

export default AssociateSignUp;