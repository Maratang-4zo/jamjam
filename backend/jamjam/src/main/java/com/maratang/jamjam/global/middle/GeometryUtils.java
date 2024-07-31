package com.maratang.jamjam.global.middle;

import java.util.List;

import org.springframework.stereotype.Component;
import com.maratang.jamjam.global.station.Point;

@Component
public class GeometryUtils {
	public Point calculateCentroid(List<Point> points) {
		double sumX = 0;
		double sumY = 0;
		for (Point p : points) {
			sumX += p.getX();
			sumY += p.getY();
		}
		double centroidX = sumX / points.size();
		double centroidY = sumY / points.size();
		return new Point(centroidX, centroidY);
	}
}
