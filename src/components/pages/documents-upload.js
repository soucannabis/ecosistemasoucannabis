import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import directusRequestUpload from "../../modules/directusRequestUpload";
import apiRequest from "../../modules/apiRequest";
import User from "../../modules/User";
import AlertError from "../forms/AlertError";
import Resizer from "react-image-file-resizer";

const FileUploadComponent = () => {
  const [user, setUser] = useState({});
  const [rgProof, setRgProof] = useState(false);
  const [rg_patient_proof, setRg_patient_proof] = useState(false);
  const [proof_of_address, setProof_of_address] = useState(false);
  const [contract, setContract] = useState(false);
  const [generateContract, setGenerateContract] = useState(false);
  const [docError, setdocError] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingC, setIsLoadingC] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [buttonMsg, setButtonMsg] = useState(false);

  var userData = {};

  setTimeout(async () => {
    userData = await User();
    setUser(userData);
  }, 4000);

  if (user.associate_status == 4) {
    window.location.assign("/consulta");
  }

  useEffect(() => {
    (async function () {
      userData = await User();
      setUser(userData);

      if (userData.rg_proof == null) {
        setRgProof(false);
      } else {
        setRgProof(true);
      }

      if (userData.rg_patient_proof == null) {
        setRg_patient_proof(false);
      } else {
        setRg_patient_proof(true);
      }
      if (userData.proof_of_address == null) {
        setProof_of_address(false);
      } else {
        setProof_of_address(true);
      }
      if (userData.contract == null) {
        setContract(false);
      } else {
        setContract(true);
      }
      if (userData.responsable_type == "himself" || userData.responsable_type == "pet") {
        setVisible(true);
      } else {
        setVisible(false);
      }
    })();
  }, []);

  const handleFileAssociateChange = async event => {
    const file = event.target.files[0];

    if (file) {
      const createFolder = await apiRequest("/api/directus/create-folder", { name: user.user_code }, "POST");
      var userFolder = createFolder.id;
      localStorage.setItem("user_folder", userFolder);

      await apiRequest("/api/directus/update", { userId: user.id, formData: { user_path: userFolder } }, "POST");

      file.storage = "local";

      var fileName = file.name;
      fileName = fileName.split(".");
      var nameFile = "doc-identidade-" + user.name_associate + "-" + user.lastname_associate + "-" + user.user_code + "." + fileName[1];
      nameFile = nameFile.replace(/\s/g, "");
      nameFile = nameFile.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      nameFile = nameFile.replace(/ç/g, "c");

      if (fileName[1] == "jpg" || fileName[1] == "jpeg" || fileName[1] == "png" || fileName[1] == "gif" || fileName[1] == "pdf") {
        setIsLoading(true);

        var formData = new FormData();
        formData.append("folder", userFolder);
        formData.append("file", file, nameFile);

        var fileId = "não-carregou-o-arquivo";

        await directusRequestUpload("/files", formData, "POST", { "Content-Type": "multipart/form-data" }).then(response => {
          if (response) {
            fileId = response.id;

            if (fileId != "não-carregou-o-arquivo" && fileId != "") {
              setButtonMsg(true);
              return fileId;
            }
            
          } else {
            setdocError(true);
            setTimeout(() => {
              setdocError(false);
            }, 5000);
          }
        });

        if (fileId != "não-carregou-o-arquivo") {
          const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth();
          const year = currentDate.getFullYear();
          const monthName = months[month];
          const formattedDate = `${day} de ${monthName} de ${year}`;

          const fullname = user.name_associate + " " + user.lastname_associate;

          var userData = [
            {
              name: "usercode",
              default_value: await user.id,
              readonly: true,
            },
            {
              name: "email",
              default_value: await user.email_account,
              readonly: true,
            },
            {
              name: "Nome do Responsavel",
              default_value: await fullname,
              readonly: true,
            },
            {
              name: "Estado Civil",
              default_value: await user.marital_status,
              readonly: true,
            },
            {
              name: "Nacionalidade",
              default_value: await user.nationality,
              readonly: true,
            },
            {
              name: "CPF",
              default_value: await user.cpf_associate,
              readonly: true,
            },
            {
              name: "RG",
              default_value: await user.rg_associate,
              readonly: true,
            },
            {
              name: "Orgao",
              default_value: await user.emiiter_rg_associate,
              readonly: true,
            },
            {
              name: "Rua",
              default_value: await user.street,
              readonly: true,
            },
            {
              name: "Numero",
              default_value: await user.number,
              readonly: true,
            },
            {
              name: "Bairro",
              default_value: await user.neighborhood,
              readonly: true,
            },
            {
              name: "Cidade",
              default_value: await user.city,
              readonly: true,
            },
            {
              name: "Estado",
              default_value: await user.state,
              readonly: true,
            },
            {
              name: "CEP",
              default_value: await user.cep,
              readonly: true,
            },
            {
              name: "Data",
              default_value: await formattedDate,
              readonly: true,
            },
          ];

          await apiRequest("/api/directus/upload-files", { userId: user.id, fileId: fileId }, "POST");
          await apiRequest("/api/directus/update", { userId: user.id, formData: { rg_proof: fileId } }, "POST");
          await apiRequest("/api/directus/update", { userId: user.id, formData: { status: "proofs" } }, "POST");

          const createContract = await apiRequest("/api/docuseal/create-contract", userData, "POST");
          setGenerateContract(process.env.REACT_APP_DOCUSEAL_URL + "/s/" + (await createContract[0].slug));

          const bodyRequest = { contract: process.env.REACT_APP_DOCUSEAL_URL + "/s/" + (await createContract[0].slug) };
          await apiRequest("/api/directus/update", { userId: user.id, formData: bodyRequest }, "POST");

          setRgProof(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        setFileError(true);
        setTimeout(() => {
          setFileError(false);
        }, 5000);
      }
    }
  };

  const handlePatientFileChange = async event => {
    const file = event.target.files[0];

    var userFolder = localStorage.getItem("user_folder");

    if (file) {
      file.storage = "local";
      file.filename_download = file.name;

      var fileName = file.name;
      fileName = fileName.split(".");
      var nameFile = "doc-paciente-" + user.name_associate + "-" + user.lastname_associate + "-" + user.user_code + "." + fileName[1];
      nameFile = nameFile.replace(/\s/g, "");
      nameFile = nameFile.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      nameFile = nameFile.replace(/ç/g, "c");

      if (fileName[1] == "jpg" || fileName[1] == "jpeg" || fileName[1] == "png" || fileName[1] == "gif" || fileName[1] == "pdf") {
        setIsLoadingC(true);

        var formData = new FormData();
        formData.append("folder", userFolder);
        formData.append("file", file, nameFile);

        var fileId = "não-carregou-o-arquivo";

        await directusRequestUpload("/files", formData, "POST", { "Content-Type": "multipart/form-data" }).then(response => {
          if (response) {
            fileId = response.id;
            setButtonMsg(true);
            return fileId;
          } else {
            setdocError(true);
            setTimeout(() => {
              setdocError(false);
            }, 5000);
          }
        });

        const bodyRequest = { rg_patient_proof: fileId };
        await apiRequest("/api/directus/update", { userId: user.id, formData: bodyRequest }, "POST");

        await apiRequest("/api/directus/upload-files", { userId: user.id, fileId: fileId }, "POST");

        setRg_patient_proof(true);
        setIsLoadingC(false);
      }
    } else {
      setFileError(true);
      setTimeout(() => {
        setFileError(false);
      }, 5000);
    }
  };

  return (
    <div class="justify-content-center">
      <h1 style={{ paddingTop: "60px" }}>Envie seu Documento de Identidade</h1>
      <h2 style={{ textAlign: "center" }}>Clique no botão para enviar uma foto de seu comprovante de identidade.</h2>
      <h2 style={{ textAlign: "center" }}>Você pode enviar a parte de trás do seu RG ou seu CNH.</h2>
      <br></br>
      <div class="">
        {!rgProof && (
          <Form>
            <Form.Group controlId="formFile1">
              <Form.Label className="label-upload">
                {isLoading && (
                  <span className="loading-text">
                    <img className="animated-icon" width="40" src="/icons/data-cloud.gif" />
                    {!buttonMsg ? <span>Carregando documento...</span> : <span class="gernerate-term">Gerando termo para assinatura</span>}
                    <img className="animated-icon" width="40" src="/icons/data-cloud.gif" />
                  </span>
                )}
                {!isLoading && <span>Documento de identidade</span>}
              </Form.Label>
              <Form.Control className="input-upload" type="file" onChange={handleFileAssociateChange} />
            </Form.Group>
          </Form>
        )}
        {rgProof && (
          <div class="document-send">
            <Form.Label className="label-upload send-ok">Comprovante de identidade enviado</Form.Label>
          </div>
        )}

        {!rg_patient_proof && (
          <Form hidden={visible}>
            <Form.Group controlId="formFile3">
              <Form.Label className="label-upload">
                {isLoadingC && (
                  <span class="loading-text">
                    <img class="animated-icon" width="40" src="/icons/data-cloud.gif" /> Carregando documento... <img class="animated-icon" width="40" src="/icons/data-cloud.gif" />
                  </span>
                )}
                {!isLoadingC && <span class="doc-patient">Documento de Identidade do paciente</span>}
              </Form.Label>
              <Form.Control className="input-upload" type="file" onChange={handlePatientFileChange} />
            </Form.Group>
          </Form>
        )}

        {rg_patient_proof && (
          <div class="document-send">
            <Form.Label hidden={visible} className="label-upload send-ok">
              Documento de Identidade enviado
            </Form.Label>
          </div>
        )}
        <br></br>

        <a className="label-upload assign-term" target="_blank" href={generateContract || user.contract} hidden={!rgProof}>
          Assinar Termo de Responsabilidade
        </a>
      </div>
      {docError && (
        <div class="alert1">
          <AlertError message="Erro ao enviar o arquivo, recarregue a página e tente novamente." />
        </div>
      )}
      {fileError && (
        <div class="alert1">
          <AlertError message="Formato do documento inválido, formatos aceitos (JPG, PNG, GIF e PDF)" />
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
