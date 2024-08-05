export const getUserInfo = async () => {
  try {
    const response = await axios.get("/api/members/info");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패", error);
    throw error;
  }
};

export const updateUserNickname = async (nickname) => {
  try {
    await axios.post("/api/members/info", { nickname });
  } catch (error) {
    console.error("닉네임 수정 실패", error);
    throw error;
  }
};
