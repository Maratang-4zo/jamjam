package com.maratang.jamjam.global.map.middle;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Stack;

import org.springframework.stereotype.Component;

import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.map.station.Point;

@Component
public class GrahamScan {
	public List<Point> convexHull(List<Point> points) {
		Collections.sort(points);

		if (points.isEmpty()) {
			throw new BusinessException(ErrorCode.MIDDLE_EVERY_EMPTY_LOCATION);
		}

		Point pivot = points.get(0);

		points.sort((a, b) -> {
			int order = Point.ccw(pivot, a, b);
			if (order == 0) {
				return Double.compare(pivot.distance(a), pivot.distance(b));
			}
			return -order;
		});

		Stack<Point> hull = new Stack<>();
		for (Point p : points) {
			while (hull.size() > 1 && Point.ccw(hull.get(hull.size() - 2), hull.peek(), p) <= 0) {
				hull.pop();
			}
			hull.push(p);
		}

		return new ArrayList<>(hull);
	}
}


