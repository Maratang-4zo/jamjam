import React, { useEffect, useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "../../recoil/atoms/userState";
import { roomAtom } from "../../recoil/atoms/roomState";
import Avatar1 from "../../assets/avatars/1.png";

function MyMap() {
  const navermaps = useNavermaps();
  const userInfo = useRecoilValue(userInfoAtom);
  const roomState = useRecoilValue(roomAtom);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map && userInfo.departure.latitude && userInfo.departure.longitude) {
      map.panTo(
        new navermaps.LatLng(
          userInfo.departure.latitude,
          userInfo.departure.longitude,
        ),
      );
    }
  }, [userInfo.departure]);

  useEffect(() => {
    if (map && roomState.isCenterExist) {
      map.panTo(
        new navermaps.LatLng(
          roomState.centerPlace.latitude,
          roomState.centerPlace.longitude,
        ),
      );
    }
  }, [roomState.centerPlace, map, navermaps]);

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(37.5012748, 127.039625)}
      defaultZoom={17}
      ref={setMap}
    >
      {userInfo.departure.latitude && userInfo.departure.longitude && (
        <Marker
          position={
            new navermaps.LatLng(
              userInfo.departure.latitude,
              userInfo.departure.longitude,
            )
          }
          icon={{
            content: `<img src="${Avatar1}" style="width:40px;height:40px;" />`,
          }}
        />
      )}
      {roomState.isCenterExist && (
        <Marker
          position={
            new navermaps.LatLng(
              roomState.centerPlace.latitude,
              roomState.centerPlace.longitude,
            )
          }
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
