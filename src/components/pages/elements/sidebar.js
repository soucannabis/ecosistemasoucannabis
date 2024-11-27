import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import User from "../../../modules/User";
import CheckIcon from "./checkIcon";
import Contact from "../modals/contact";
import Cart from "./cart";

const Sidebar = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();
  }, []);

  return (
    <div>
      <div>
        <div className="bg-green text-white">
          <ul className="listPages">
            {user.associate_status === 0 && (
              <div>
                <Link to="/cadastro-associado">
                  <li className="item-selected">
                    <CheckIcon status={1} size={32} />
                    Cadastro de associado
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Documentação
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Consulta
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Aprovação do cadastro
                  </li>
                </Link>
              </div>
            )}
            {user.associate_status === 2 && (
              <div>
                <Link to="/cadastro-associado">
                  <li className="item-selected">
                    <CheckIcon status={1} size={32} />
                    Cadastro de associado
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Documentação
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Consulta
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Aprovação do cadastro
                  </li>
                </Link>
              </div>
            )}
            {user.associate_status === 3 && (
              <div>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Cadastro de associado
                  </li>
                </Link>
                <Link to="/documentos">
                  <li className="item-selected">
                    <CheckIcon status={1} size={32} />
                    Documentação
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Consulta
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Aprovação do cadastro
                  </li>
                </Link>
              </div>
            )}
            {user.associate_status === 4 && (
              <div>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Cadastro de associado
                  </li>
                </Link>
                <Link to="/documentos">
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Documentação
                  </li>
                </Link>
                <Link>
                  <li className="item-selected">
                    <CheckIcon status={1} size={32} />
                    Consulta
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Aprovação do cadastro
                  </li>
                </Link>
              </div>
            )}
            {user.associate_status === 5 && (
              <div>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Cadastro de associado
                  </li>
                </Link>
                <Link to="/documentos">
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Documentação
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Consulta
                  </li>
                </Link>
                <Link>
                  <li className="disabled">
                    <CheckIcon status={1} size={32} />
                    Aprovação do cadastro
                  </li>
                </Link>
              </div>
            )}
            {user.associate_status === 6 && (
              <div>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Solicitação de contato
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Cadastro de associado
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Documentação
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Consulta
                  </li>
                </Link>
                <Link to="/cadastro-aprovado">
                  <li className="item-selected">
                    <CheckIcon status={1} size={32} />
                    Aprovação do cadastro
                  </li>
                </Link>
              </div>
            )}
            {user.associate_status === 7 && (
              <div>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Solicitação de contato
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Cadastro de associado
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Documentação
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Consulta
                  </li>
                </Link>
                <Link>
                  <li className="line-through">
                    <CheckIcon status={2} size={32} />
                    Cadastro Concluído
                  </li>
                </Link>
              </div>
            )}
          </ul>
        </div>
        <Cart />
        <br></br>
        <br></br>
        <br></br>
        <Contact/>
      </div>
    </div>
  );
};

export default Sidebar;
