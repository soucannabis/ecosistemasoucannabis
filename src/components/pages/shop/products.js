import React, { useState, useEffect } from "react";
import User from "../../../modules/User";
import Products from "../../../modules/Products";
import Cart from "../elements/cart";
import Modal from "react-bootstrap/Modal";
import apiRequest from "../../../modules/apiRequest";

function Shop() {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [cart, setCart] = useState([]);
  const [popupContent, setPopupContent] = useState([]);
  const [productQnt, setProductQnt] = useState(1);
  const [coupon, setCoupon] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [prescriptionPopup, setPrescriptionPopup] = useState(false);
  const handleClose = () => setShowPopup(false);
  const handleShow = () => setShowPopup(true);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);

      const productsData = await Products();
      console.log(productsData)
      setProducts(productsData.response.productsList);

      const coupon = await apiRequest("/api/directus/coupons?couponSearchId=" + userData.id, "", "GET");
      setCoupon(coupon)

      var date = new Date();
      var date_prescription = new Date(userData.date_prescription);
      var diferencaEmMilissegundos = date - date_prescription;
      var dateDiffDays = Math.floor(
        diferencaEmMilissegundos / (1000 * 60 * 60 * 24),
      );

      if (dateDiffDays > 365) {
        setPrescriptionPopup(true)
      }

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

  const dateUser = new Date(user.date_prescription);
  const datePrescription = dateUser.toLocaleDateString("pt-BR");

  const tableHeaders = [
    { key: "name", label: "Nome do Produto" },
    { key: "price", label: "Valor" },
    { key: "qnt", label: "Quantidade" },
    { key: "checkout", label: "+ Carrinho" },
  ];

  const filteredProducts = sortProducts().filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  function addCart(product) {
    const productCart = cart.some(item => item.id === product.id);
    var productQnt = parseInt(document.getElementById(product.cod).value)

    product.qntProductCart = productQnt
    product.price = product.price * productQnt

    if (!productCart) {
      setCart([...cart, product]);
    }

  }

  function deleteItem(product) {
    setCart(product);
  }

  function info(event) {
    const productCod = event.target.getAttribute("cod");
    setPopupContent(productCod);
    setShowPopup(true);
  }

  function productQntHandle(id, value, el) {   
    setProductQnt(prevState => ({
      ...prevState,
      [id]: value
    }));
  }


  return (
    <div>
      <Modal show={prescriptionPopup}>
        <Modal.Header>
          <Modal.Title><h4>Acesso Negado</h4></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Sua Prescrição está fora da validade.</h5>
          <h5>O prazo de validade de uma Prescrição é de um ano.</h5>
          <h5>Sua prescrição é do dia: {datePrescription}.</h5>
          <br />
          <h5>Por favor, entre em contato com nossa equipe de acolhimento para renovar sua prescrição.</h5>
        </Modal.Body>
      </Modal>

      <Modal show={showPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{popupContent}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5></h5>
        </Modal.Body>
      </Modal>

      {prescriptionPopup && (
        <style>
          {`
         .fade.modal.show {
           background-color: #000000cc;
         }
         .modal-dialog {
          max-width: 50%;
          margin-top: 10%;
      }
       `}
        </style>
      )}


      {!prescriptionPopup && (
        <div>
          <div>
            <div>
              <div class="sidebar" >
                <h4 style={{ textAlign: "center", marginBottom: "30px" }}>Carrinho de compras</h4>
                {coupon ? (
                  coupon.type === "percentage" ? (
                    <p>Você tem um cupom com {coupon.discount}% de desconto</p>
                  ) : (
                    <p>Você tem um cupom com R${coupon.discount} reais de desconto</p>
                  )
                ) : (
                  <></>
                )}


                <Cart items={cart} coupon={coupon} onDeleteItem={deleteItem} />
              </div>
            </div>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Pesquisar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>Ordenar {sortOrder === "asc" ? "A-Z" : "Z-A"}</button>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="container">
              <table className="table" style={{ width: "63%", backgroundColor: "#fff", marginLeft: "auto", marginRight: "0", paddingLeft:"20px" }}>
                <thead style={{ backgroundColor: "#4e774d", color: "#fff" }}>
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
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.cod}>
                      <td onClick={info} style={{ cursor: "pointer", paddingLeft:"45px", fontSize:"18px", fontWeight:600 }} cod={product.cod}>{product.cod + " - " + product.concentration + "%"}</td>
                      <td style={{fontSize:"16px", fontWeight:600}}>R${String(product.price)}</td>
                      <td>
                        <select onChange={(e) => productQntHandle(product.cod, e.target.value, e)} id={product.cod} style={{marginLeft:"25px"}}>
                          {JSON.parse(user.products)
                            .filter(prod => prod.product === product.cod)
                            .map(userProd => {
                              const loop = userProd.qnt;
                              return Array.from({ length: loop }, (_, i) => (
                                <option   key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ));
                            })}
                        </select>
                      </td>
                      <td>
                        <button width="38" height="38" alt="checkout" onClick={() => addCart(product)}>
                         + Carrinho
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ) : (
            <p>Nenhum resultado encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Shop;
