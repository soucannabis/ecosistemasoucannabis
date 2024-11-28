import axios from "axios";

async function apiRequest(query, body, method, headers) {
  var requestData = [];

  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_SERVER_URL + query,
    headers: {
      Authorization: import.meta.env.VITE_SERVER_API_TOKEN,
    },
    data: body,
  };

  if (!headers) {
    config.headers = { ...config.headers, "Content-Type": "application/json" };
  } else {
    config.headers = { ...config.headers, ...headers };
  }

  await axios
    .request(config)
    .then(response => {
      requestData = response.data;
      return requestData;
    })
    .catch(error => {
      console.log(error);
    });

  return requestData;
}

export default apiRequest;
