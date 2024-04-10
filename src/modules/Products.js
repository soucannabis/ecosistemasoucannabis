import apiRequest from "./apiRequest";
import user from "./User";

async function Products() {
  let requestData = [];

  const userData = await user();
  
  try {
    requestData = await apiRequest("/api/directus/products?products="+userData.products+"&coupon="+userData.coupon, "", "GET");
  } catch (error) {
    console.log(error);
  }

  return requestData;
}

export default Products;
