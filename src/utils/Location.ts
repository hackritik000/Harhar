// let latitude =0;
// let longitude = 0;
// export async function getCurruntLocation () {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       latitude = position.coords.latitude;
//       longitude = position.coords.longitude;
//       console.log(latitude,longitude)
//       const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
//        const data = await fetch(url);
//       const newData = await data.json()
//       return newData;

//     });
//   } else {
//     return {
//       message: "Geolocation not supported by this browser.",
//     };
//   }

//   console.log(latitude  , longitude , "new one") 

//   return {latitude,longitude};
// }

export async function getCurrentLocation() {
  if (navigator.geolocation) {
    try {
      // Wrap geolocation in a promise
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      // // Update latitude and longitude with retrieved coordinates
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      // console.log(latitude, longitude);
      
      // Fetch location data
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const data = await fetch(url);
      const newData = await data.json();
      return newData;

    } catch (error) {
      return { message: "Error retrieving geolocation data." };
    }
  } else {
    return { message: "Geolocation not supported by this browser." };
  }
}