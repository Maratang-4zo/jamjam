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
import { userColor } from "../../utils/userColor";
import fireGif from "../../assets/icons/fire-fireball.gif";
import pinIcon from "../../assets/icons/pinIcon.png";
import { lineColor } from "../../utils/lineColor";
import { roundCenterAtom } from "../../recoil/atoms/gameState";

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
  const roundCenter = useRecoilValue(roundCenterAtom);

  useEffect(() => {
    const fetchuserColors = async () => {
      const colorThief = new ColorThief();
      const departures = await Promise.all(
        roomInfo.attendees.map(async (attendee) => {
          const route = attendee.route ? decodePath(attendee.route) : null;
          let color = userColor[attendee.profileImageUrl];

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

    fetchuserColors();
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

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (hours > 0) {
      return `${hours}시간`;
    } else if (minutes > 0) {
      return `${minutes}분`;
    } else {
      return "1분 미만";
    }
  };

  const bounceAnimation = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      60% {
        transform: translateY(-15px);
      }
    }
  `;

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
        ?.filter((departure) => departure.lat && departure.lon)
        .map((departure, index) => (
          <React.Fragment key={index}>
            <Marker
              position={new navermaps.LatLng(departure.lat, departure.lon)}
              icon={{
                content: `
                  <style>
                    ${bounceAnimation}
                  </style>
                  <div style="display: flex; flex-direction: column; align-items: center; animation: bounce 1s ease;">
                    <img src="${departure.profileImageUrl}" style="width:40px;height:40px;border-radius:50%;" />
                    <span style="text-shadow: 
        -1.5px -1px 0 #000,  
        1.5px -1px 0 #000, 
        -1.5px 1px 0 #000, 
        1.5px 1px 0 #000;font-size: 20px; color: #FFE845; font-weight:600; margin-top: 2px; font-family: DungGeunMo">
                      ${departure.nickname}
                    </span>
                  </div>
                `,
                anchor: new navermaps.Point(20, 20), // 마커 중심점을 이미지 중앙으로 조정
              }}
            />
            {roomPage === "main" &&
              roomInfo.isCenterExist &&
              departure.route &&
              departure.duration && (
                <>
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
                  />

                  <Marker
                    position={
                      new navermaps.LatLng(
                        departure.route[
                          Math.floor(departure.route.length / 2)
                        ][0],
                        departure.route[
                          Math.floor(departure.route.length / 2)
                        ][1],
                      )
                    }
                    icon={{
                      content: `

      <div style="background: ${
        departure.color
      }; padding: 3px 5px; border-radius: 5px; border: none; font-size: 14px; box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.35);">
        <span style="font-family: 'OldGalmuri'; color: white; text-shadow: 
        -1px -1px 0 #000,  
        1px -1px 0 #000, 
        -1px 1px 0 #000, 
        1px 1px 0 #000;">
          ${formatDuration(departure.duration)}
        </span>
      </div>
    `,
                      anchor: new navermaps.Point(35, 10), // 마커 중심점을 이미지 중앙으로 조정
                    }}
                  />
                </>
              )}
          </React.Fragment>
        ))}
      {roomInfo.isCenterExist && roomPage === "main" ? (
        <Marker
          position={
            new navermaps.LatLng(
              roomInfo.centerPlace.latitude + 0.007,
              roomInfo.centerPlace.longitude,
            )
          }
          icon={{
            content: `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <span style="
            font-family: 'DungGeunMo'; 
            background-color: white; 
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.35); 
            border-radius: 5px; 
            padding: 3px; 
            border: 2px solid ${
              roomInfo.centerPlace.subwayLines &&
              roomInfo.centerPlace.subwayLines.length > 0
                ? lineColor[roomInfo.centerPlace.subwayLines[0]]
                : "black"
            };
          ">
            ${roomInfo.centerPlace.name}
          </span>
          <img src="${fireGif}" style="width:50px; height:50px;" />
        </div>
      `,
            anchor: new navermaps.Point(25, 25), // 이미지 중심점을 조정
          }}
        />
      ) : null}

      {roundCenter && roomPage === "gamefinish" ? (
        <Marker
          position={
            new navermaps.LatLng(
              roundCenter.latitude + 0.007,
              roundCenter.longitude,
            )
          }
          icon={{
            content: `

        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; animation: bounce 1s ease infinite;">
          <span style="
            font-family: 'DungGeunMo'; 
            background-color: white; 
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.35); 
            border-radius: 5px; 
            padding: 3px; 
            border: 2px solid ${
              roundCenter.subwayLines && roundCenter.subwayLines.length > 0
                ? lineColor[roundCenter.subwayLines[0]]
                : "black"
            };
          ">
            ${roundCenter.name}
          </span>
          <img src="${pinIcon}" style="width:50px; height:50px;" />
        </div>
      `,
            anchor: new navermaps.Point(25, 50), // 이미지 중심점을 조정
          }}
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
        <style>
          ${bounceAnimation}
        </style>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; animation: bounce 1s ease infinite;">
          <span style="
            font-family: 'DungGeunMo'; 
            background-color: white; 
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.35); 
            border-radius: 5px; 
            padding: 3px; 
            border: 2px solid ${
              selectedStation.subwayLines &&
              selectedStation.subwayLines.length > 0
                ? lineColor[selectedStation.subwayLines[0]]
                : "black"
            };
          ">
          ${selectedStation.name}
          </span>
          <img src="${pinIcon}" style="width:50px; height:50px;" />
        </div>
              `,
              anchor: new navermaps.Point(25, 70),
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
