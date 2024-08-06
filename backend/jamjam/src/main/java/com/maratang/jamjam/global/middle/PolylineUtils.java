package com.maratang.jamjam.global.middle;

import java.util.ArrayList;
import java.util.List;

public class PolylineUtils {

	public static List<double[]> decode(String encoded) {
		List<double[]> poly = new ArrayList<>();
		int index = 0, len = encoded.length();
		int lat = 0, lng = 0;

		while (index < len) {
			int b, shift = 0, result = 0;
			do {
				b = encoded.charAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
			int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
			lat += dlat;

			shift = 0;
			result = 0;
			do {
				b = encoded.charAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
			int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
			lng += dlng;

			double[] point = new double[2];
			point[0] = lat / 1E5;
			point[1] = lng / 1E5;
			poly.add(point);
		}

		return poly;
	}

	public static String encode(List<double[]> points) {
		StringBuilder encoded = new StringBuilder();
		int prevLat = 0, prevLng = 0;

		for (double[] point : points) {
			int lat = (int) Math.round(point[0] * 1E5);
			int lng = (int) Math.round(point[1] * 1E5);

			int dLat = lat - prevLat;
			int dLng = lng - prevLng;

			prevLat = lat;
			prevLng = lng;

			encoded.append(encodeValue(dLat));
			encoded.append(encodeValue(dLng));
		}

		return encoded.toString();
	}

	private static String encodeValue(int value) {
		value = value < 0 ? ~(value << 1) : value << 1;
		StringBuilder encoded = new StringBuilder();

		while (value >= 0x20) {
			encoded.append((char) ((0x20 | (value & 0x1f)) + 63));
			value >>= 5;
		}
		encoded.append((char) (value + 63));
		return encoded.toString();
	}
}

