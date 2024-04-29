export const getGeolocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        () => {
          reject(new Error("Unable to retrieve your location"));
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser"));
    }
  });
};
