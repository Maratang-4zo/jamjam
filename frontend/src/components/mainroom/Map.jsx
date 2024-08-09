import React, { useEffect, useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  Polyline,
  useNavermaps,
} from "react-naver-maps";
import { useRecoilValue } from "recoil";
import {
  isNextMiddleExistAtom,
  roomAtom,
  roomPageAtom,
  selectedStationAtom,
} from "../../recoil/atoms/roomState";
import useDecoding from "../../hooks/useDecoding";
import ColorThief from "colorthief";

function MyMap() {
  const navermaps = useNavermaps();
  const roomInfo = useRecoilValue(roomAtom);
  const selectedStation = useRecoilValue(selectedStationAtom);
  const roomPage = useRecoilValue(roomPageAtom);
  const isNextMiddleExist = useRecoilValue(isNextMiddleExistAtom);
  const [map, setMap] = useState(null);
  const [attendeeDepartures, setAttendeeDepartures] = useState([]);
  const [visibleDurationIndex, setVisibleDurationIndex] = useState(null);
  const { decodePath } = useDecoding();
  const defaultCenter = {
    lat: 37.5012748,
    lon: 127.039625,
  };
  const [centerPoint, setCenterPoint] = useState(defaultCenter);

  const routeColor = {
    "https://github.com/user-attachments/assets/81c6e571-004e-4905-a563-98e315fd5413":
      "#7304D7",
    "https://github.com/user-attachments/assets/20f9f469-2687-46ef-893b-a932d048a921":
      "#5665FF",
    "https://github.com/user-attachments/assets/ba8d1f38-a48c-4581-be35-9e00d01ce31f":
      "#FB3E01",
    "https://github.com/user-attachments/assets/28991fc0-1e74-4c56-908b-6a133946a39a":
      "#C328D0",
    "https://github.com/user-attachments/assets/9ab979f9-50a9-4b79-a755-d135a8772048":
      "#13BABF",
    "https://github.com/user-attachments/assets/5ed15082-6117-4c26-8781-21b82281d625":
      "#FB038E",
    "https://github.com/user-attachments/assets/abd3aedb-207c-429f-a47a-8d631a34a41b":
      "#FB3E01",
    "https://github.com/user-attachments/assets/addd99b2-a661-4640-a490-a20108bfa3e0":
      "#5665FF",
    "https://github.com/user-attachments/assets/de6abb23-a2e0-4839-b4b3-d130474b0705":
      "#FCAF01",
    "https://github.com/user-attachments/assets/b652768d-733e-4fbd-928b-003e999c5962":
      "#77C914",
    "https://github.com/user-attachments/assets/8cad8c12-2dff-478d-91ff-e693c0119b6c":
      "#FEDB00",
    "https://github.com/user-attachments/assets/229b38a5-0024-4c1c-ad5a-b3ad613ccf8c":
      "#D2D600",
  };

  useEffect(() => {
    const fetchRouteColors = async () => {
      const colorThief = new ColorThief();
      const departures = await Promise.all(
        roomInfo.attendees.map(async (attendee) => {
          const route = attendee.route ? decodePath(attendee.route) : null;
          let color = routeColor[attendee.profileImageUrl];

          if (!color) {
            try {
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = attendee.profileImageUrl;
              await new Promise((resolve) => {
                img.onload = () => {
                  const result = colorThief.getColor(img);
                  color = `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
                  resolve();
                };
              });
            } catch (error) {
              color = "#000000"; // 기본 색상
              console.error("Error fetching color from image:", error);
            }
          }

          return {
            lat: attendee.lat,
            lon: attendee.lon,
            nickname: attendee.nickname,
            profileImageUrl: attendee.profileImageUrl,
            route,
            duration: attendee.duration,
            color,
          };
        }),
      );

      setAttendeeDepartures(departures);
    };

    fetchRouteColors();
  }, [roomInfo.attendees, decodePath]);

  useEffect(() => {
    if (roomInfo.isCenterExist) {
      setCenterPoint({
        lat: roomInfo.centerPlace.latitude,
        lon: roomInfo.centerPlace.longitude,
      });
    }
  }, [roomInfo.isCenterExist, roomInfo.centerPlace]);

  useEffect(() => {
    if (map) {
      const bounds = new navermaps.LatLngBounds();
      let hasValidLocation = false;

      if (selectedStation && roomPage === "gamefinish" && !isNextMiddleExist) {
        bounds.extend(
          new navermaps.LatLng(
            selectedStation.latitude,
            selectedStation.longitude,
          ),
        );
        selectedStation.stores.forEach((store) => {
          bounds.extend(new navermaps.LatLng(store.latitude, store.longitude));
        });
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      } else {
        attendeeDepartures.forEach((departure) => {
          if (departure.lat && departure.lon) {
            bounds.extend(new navermaps.LatLng(departure.lat, departure.lon));
            hasValidLocation = true;
          }
        });

        if (hasValidLocation) {
          if (roomInfo.isCenterExist) {
            bounds.extend(
              new navermaps.LatLng(
                roomInfo.centerPlace.latitude,
                roomInfo.centerPlace.longitude,
              ),
            );
          }
          map.fitBounds(bounds);
        } else {
          setCenterPoint(defaultCenter);
          map.setCenter(
            new navermaps.LatLng(defaultCenter.lat, defaultCenter.lon),
          );
          map.setZoom(17);
        }
      }
    }
  }, [
    map,
    attendeeDepartures,
    roomInfo.isCenterExist,
    roomInfo.centerPlace,
    selectedStation,
    isNextMiddleExist,
    navermaps,
  ]);

  const handlePolylineClick = (index) => {
    setVisibleDurationIndex(index);
  };

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(centerPoint.lat, centerPoint.lon)}
      defaultZoom={17}
      ref={setMap}
      scrollWheel={false}
      draggable={false}
      disableDoubleClickZoom={true}
      disableDoubleTapZoom={true}
      disableTwoFingerTapZoom={true}
    >
      {attendeeDepartures
        .filter((departure) => departure.lat && departure.lon)
        .map((departure, index) => (
          <React.Fragment key={index}>
            <Marker
              position={new navermaps.LatLng(departure.lat, departure.lon)}
              icon={{
                content: `
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="${departure.profileImageUrl}" style="width:40px;height:40px;border-radius:50%;" />
                    <span style="border: 2px solid ${departure.color}; background: white; padding: 2px 5px; border-radius: 10px; font-size: 13px; color: black; font-weight:600; margin-top: 2px;">
                      ${departure.nickname}
                    </span>
                  </div>
                `,
                anchor: new navermaps.Point(20, 20), // 마커 중심점을 이미지 중앙으로 조정
              }}
            />
            {roomPage === "main" &&
              roomInfo.isCenterExist &&
              departure.route && (
                <Polyline
                  path={departure.route.map(
                    (point) => new navermaps.LatLng(point[0], point[1]),
                  )}
                  clickable={true}
                  strokeColor={departure.color}
                  strokeStyle={"solid"}
                  strokeWeight={5}
                  strokeOpacity={1}
                  strokeLineJoin={"miter"}
                  strokeLineCap={"round"}
                  onClick={() => handlePolylineClick(index)}
                />
              )}

            {visibleDurationIndex === index && (
              <Marker
                position={
                  new navermaps.LatLng(
                    departure.route[Math.floor(departure.route.length / 2)][0],
                    departure.route[Math.floor(departure.route.length / 2)][1],
                  )
                }
                icon={{
                  content: `
                    <div style="background: white; padding: 2px 5px; border-radius: 10px; border: 2px solid black; font-size: 13px; color: black;">
                      ${departure.duration}
                    </div>
                  `,
                  anchor: new navermaps.Point(10, 10), // 마커 중심점을 이미지 중앙으로 조정
                }}
              />
            )}
          </React.Fragment>
        ))}
      {roomInfo.isCenterExist && roomPage === "main" ? (
        <Marker
          position={
            new navermaps.LatLng(
              roomInfo.centerPlace.latitude,
              roomInfo.centerPlace.longitude,
            )
          }
        />
      ) : null}
      {selectedStation && roomPage === "gamefinish" && !isNextMiddleExist && (
        <>
          <Marker
            position={
              new navermaps.LatLng(
                selectedStation.latitude,
                selectedStation.longitude,
              )
            }
            icon={{
              content: `
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <span style="border: 2px solid black; background: white; padding: 2px 5px; border-radius: 10px; font-size: 13px; color: black;">
                    ${selectedStation.name}
                  </span>
                </div>
              `,
              anchor: new navermaps.Point(10, 10), // 마커 중심점을 이미지 중앙으로 조정
            }}
          />
          {selectedStation.stores.map((store, index) => (
            <Marker
              key={index}
              position={new navermaps.LatLng(store.latitude, store.longitude)}
              title={store.name}
              onClick={() =>
                window.open(
                  `https://map.naver.com/v5/search/${store.name}`,
                  "_blank",
                )
              }
            />
          ))}
        </>
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
