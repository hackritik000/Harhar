export function getCurruntLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      return { latitude, longitude };
    });
  } else {
    return {
      message: "Geolocation not supported by this browser.",
    };
  }
}
