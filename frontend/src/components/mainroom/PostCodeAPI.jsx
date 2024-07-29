import React, { useEffect } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useNavermaps } from "react-naver-maps";
import { useSetRecoilState } from "recoil";
import { userPlaceAtom } from "../../recoil/atoms/userState";

function PostCodeAPI({ onComplete }) {
  const navermaps = useNavermaps();
  const setUserPlace = useSetRecoilState(userPlaceAtom);

  useEffect(() => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let address = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          address += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        const geocoder = navermaps.Service.geocode(
          { address },
          (status, response) => {
            if (status !== navermaps.Service.Status.OK) {
              console.log("error");
              return alert("Something went wrong!");
            }
            const result = response.result;
            const items = result.items;
            const latitude = items[0].point.y;
            const longitude = items[0].point.x;

            const selectedAddress = { address, latitude, longitude };
            setUserPlace(selectedAddress);
            onComplete(selectedAddress);
          },
        );
      },
    }).embed(document.getElementById("postcode-container"));
  }, [navermaps, onComplete, setUserPlace]);

  return <div id="postcode-container" />;
}

export default PostCodeAPI;
