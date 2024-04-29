import { useEffect, useState } from "react";

const useGeoLocation = () => {
  const [coordinates, setCoordinates] = useState<any>(null);
  const getGeolocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
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
  useEffect(() => {
    getGeolocation();
  }, []);
  return {
    coordinates,
  };
};
export default useGeoLocation;
