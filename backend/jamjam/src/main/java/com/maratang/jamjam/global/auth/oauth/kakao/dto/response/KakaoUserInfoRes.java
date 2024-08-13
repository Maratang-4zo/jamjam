package com.maratang.jamjam.global.auth.oauth.kakao.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KakaoUserInfoRes {

	private String id;

	@JsonProperty("kakao_account")
	private KakaoAccount kakaoAccount;

	@Getter
	@Setter
	public static class KakaoAccount {
		private String email;
		private Profile profile;

		@Getter
		@Setter
		public static class Profile {
			private String nickname;

			@JsonProperty("profile_image_url") // 언더바를 카멜케이스로
			private String profileImageUrl;
		}

	}

}
