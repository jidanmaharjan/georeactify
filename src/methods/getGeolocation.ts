export const getGeolocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      return position;
    });
  } else {
    throw new Error("Geolocation is not supported by this browser");
  }
};
