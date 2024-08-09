package com.maratang.jamjam.global.auth.room.constant;

import lombok.Getter;

@Getter
public enum ProfileType {

	PROFILE1("https://github.com/user-attachments/assets/81c6e571-004e-4905-a563-98e315fd5413"),
	PROFILE2("https://github.com/user-attachments/assets/20f9f469-2687-46ef-893b-a932d048a921"),
	PROFILE3("https://github.com/user-attachments/assets/ba8d1f38-a48c-4581-be35-9e00d01ce31f"),
	PROFILE4("https://github.com/user-attachments/assets/28991fc0-1e74-4c56-908b-6a133946a39a"),
	PROFILE5("https://github.com/user-attachments/assets/9ab979f9-50a9-4b79-a755-d135a8772048"),
	PROFILE6("https://github.com/user-attachments/assets/5ed15082-6117-4c26-8781-21b82281d625"),
	PROFILE7("https://github.com/user-attachments/assets/abd3aedb-207c-429f-a47a-8d631a34a41b"),
	PROFILE8("https://github.com/user-attachments/assets/addd99b2-a661-4640-a490-a20108bfa3e0"),
	PROFILE9("https://github.com/user-attachments/assets/de6abb23-a2e0-4839-b4b3-d130474b0705"),
	PROFILE10("https://github.com/user-attachments/assets/b652768d-733e-4fbd-928b-003e999c5962"),
	PROFILE11("https://github.com/user-attachments/assets/8cad8c12-2dff-478d-91ff-e693c0119b6c"),
	PROFILE12("https://github.com/user-attachments/assets/229b38a5-0024-4c1c-ad5a-b3ad613ccf8c");

	ProfileType(String type) {
		this.type = type;
	}

	private String type;
}
