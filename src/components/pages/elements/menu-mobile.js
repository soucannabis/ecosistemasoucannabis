import React, { useState, useEffect } from "react";
import User from '../../../modules/User'
import Contact from '../modals/contact'
import { Dropdown } from 'react-bootstrap';

const MenuTopo = () => {

  const [user, setUser] = useState();

  useEffect(() => {
    (async function () {
      const userData = await User();
      setUser(userData);
    })();
  }, [])

  const [logout, setLogout] = useState(false);

  const logoutHandleChange = (event) => {
    setLogout(true);
    localStorage.removeItem("user_code")
    window.location.assign("/login");
  };

  return (
    <nav className="navbar  navbar-light fixed-top">
      <img style={{width:"25%"}} src={import.meta.env.VITE_ASSOCIATION_LOGO}></img>
      <Contact />
      <div className="">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic" className="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
              <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><g transform="scale(5.12,5.12)"><path d="M5,8c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h40c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175zM5,23c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h40c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175zM5,38c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h40c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175z"></path></g></g>
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logoutHandleChange} class="btn btn-primary">
              Sair
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>


  );
}

export default MenuTopo;
