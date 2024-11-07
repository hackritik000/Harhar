let url = "";
let apiKey = "89df8e873ac57a";

export const getLocationByIP = async () => {
  const request = await fetch("https://ipinfo.io/json?token=89df8e873ac57a");
  const jsonResponse = await request.json();

  console.log(jsonResponse.ip, jsonResponse.city);
};
