package com.maratang.jamjam.global.map.middle.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OTPUserRes {
	private Plan plan;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class Plan {
		private List<Itinerary> itineraries;

		@Getter
		@NoArgsConstructor
		@AllArgsConstructor
		@Builder
		public static class Itinerary {
			private long duration;
			private List<Leg> legs;

			@Getter
			@NoArgsConstructor
			@AllArgsConstructor
			@Builder
			public static class Leg {
				private LegGeometry legGeometry;

				@Getter
				@NoArgsConstructor
				@AllArgsConstructor
				@Builder
				public static class LegGeometry {
					private String points;
					private int length;
				}
			}
		}
	}
}
