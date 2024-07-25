import { useEffect, useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";
import { useRecoilValue } from "recoil";
import { userPlaceAtom } from "../../recoil/atoms/userState";
import Avatar1 from "../../assets/avatars/1.png";

function MyMap() {
  const navermaps = useNavermaps();
  const point = useRecoilValue(userPlaceAtom);
  const [map, setMap] = useState(null);
  useEffect(() => {
    if (map) {
      map.panTo(new navermaps.LatLng(point.latitude, point.longitude));
    }
  }, [point]);
  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(37.5012748, 127.039625)}
      defaultZoom={17}
      ref={setMap}
    >
      {point.latitude && point.longitude && (
        <Marker
          position={new navermaps.LatLng(point.latitude, point.longitude)}
          icon={{
            content: `<img src="${Avatar1}" style="width:40px;height:40px;" />`,
          }}
        />
      )}
    </NaverMap>
  );
}

function Map() {
  return (
    <MapDiv style={{ width: "100%", height: "100%" }}>
      <MyMap />
    </MapDiv>
  );
}

export default Map;
