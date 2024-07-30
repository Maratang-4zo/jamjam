import React, { useEffect, useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";
import { useRecoilValue } from "recoil";
import { userPlaceAtom } from "../../recoil/atoms/userState";
import Avatar1 from "../../assets/avatars/1.png";

function MyMap({ selectedAddress }) {
  const navermaps = useNavermaps();
  const userPlace = useRecoilValue(userPlaceAtom);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (selectedAddress && map) {
      const { latitude, longitude } = selectedAddress;
      map.panTo(new navermaps.LatLng(latitude, longitude));
    }
  }, [selectedAddress, map, navermaps]);

  useEffect(() => {
    if (map && userPlace.latitude && userPlace.longitude) {
      map.panTo(new navermaps.LatLng(userPlace.latitude, userPlace.longitude));
    }
  }, [userPlace, map, navermaps]);

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(37.5012748, 127.039625)}
      defaultZoom={17}
      ref={setMap}
    >
      {userPlace.latitude && userPlace.longitude && (
        <Marker
          position={
            new navermaps.LatLng(userPlace.latitude, userPlace.longitude)
          }
          icon={{
            content: `<img src="${Avatar1}" style="width:40px;height:40px;" />`,
          }}
        />
      )}
      {selectedAddress && (
        <Marker
          position={
            new navermaps.LatLng(
              selectedAddress.latitude,
              selectedAddress.longitude,
            )
          }
          icon={{
            content: `<img src="${Avatar1}" style="width:40px;height:40px;" />`,
          }}
        />
      )}
    </NaverMap>
  );
}

function Map({ selectedAddress }) {
  return (
    <MapDiv style={{ width: "100%", height: "100%" }}>
      <MyMap selectedAddress={selectedAddress} />
    </MapDiv>
  );
}

export default Map;
