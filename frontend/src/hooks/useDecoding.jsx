const useDecoding = () => {
  const decodePath = (encodedPath) => {
    let len = encodedPath.length;
    let index = 0;
    let array = [];
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encodedPath.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encodedPath.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      array.push([lat * 1e-5, lng * 1e-5]);
    }

    return array;
  };

  return {
    decodePath,
  };
};

export default useDecoding;
