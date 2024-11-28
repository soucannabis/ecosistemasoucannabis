import React, { useState, useEffect } from "react";
import User from "../../../modules/User";
import Products from "../../../modules/Products";
import Cart from "../elements/cart";
import Modal from "react-bootstrap/Modal";

function Contact() {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [cart, setCart] = useState([]);
  const [popupContent, setPopupContent] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const handleClose = () => setShowPopup(false);
  const handleShow = () => setShowPopup(true);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);

      const productsData = await Products();
      setProducts(productsData);

      console.log(productsData);
    })();
  }, [cart]);

  const sortProducts = () => {
    return products.slice().sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortColumn].localeCompare(b[sortColumn]);
      } else {
        return b[sortColumn].localeCompare(a[sortColumn]);
      }
    });
  };

  const tableHeaders = [
    { key: "photo", label: "" },
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    { key: "price", label: "Preço" },
    { key: "checkout", label: "Add Carrinho" },
  ];

  const filteredProducts = sortProducts().filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  function addCart(product) {
    setCart([...cart, product]);
  }

  function deleteItem(product) {
    setCart(product);
  }

  function info(event) {
    const productCod = event.target.getAttribute("cod");
    console.log("Valor da propriedade cod:", productCod);
    setPopupContent(productCod);
    setShowPopup(true);
  }

  return (
    <div>
      <Modal show={showPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{popupContent}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5></h5>
        </Modal.Body>
      </Modal>
      <div>
        <div>
          <div class="sidebar" style={{ padding: "30px" }}>
            <h4 style={{ textAlign: "center", marginBottom: "30px" }}>Carrinho de compras</h4>
            <Cart items={cart} onDeleteItem={deleteItem} />
          </div>
        </div>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Pesquisar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>Ordenar {sortOrder === "asc" ? "A-Z" : "Z-A"}</button>
      </div>
      {filteredProducts.length > 0 ? (
        <table className="table" style={{ color: "#fff", marginLeft: "410px", width: "73%" }}>
          <thead>
            <tr>
              {tableHeaders.map(header => (
                <th
                  key={header.key}
                  onClick={() => {
                    setSortColumn(header.key);
                    setSortOrder(header.key === sortColumn && sortOrder === "asc" ? "desc" : "asc");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {header.label}
                  {header.key === sortColumn && <span> {sortOrder === "asc" ? "▲" : "▼"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody >
            {filteredProducts.map(product => (
                <tr key={product.cod} >
                  <td>
                    <img src={import.meta.env.VITE_DIRECTUS_API_URL + "/assets/" + product.photo} width="50" height="50" onClick={() => addCart(product)} />
                  </td>
                  <td onClick={info} style={{ cursor: "pointer" }} cod={product.cod}>{product.name + " - " + product.concentration + "%"}</td>
                  <td>{product.description}</td>
                  <td>{String(product.price)}</td>
                  <td>
                    <button width="38" height="38" alt="checkout" onClick={() => addCart(product)}>
                      Add Cart
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}

export default Contact;
