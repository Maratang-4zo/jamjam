import java.awt.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Stack;

public class GrahamScan {
	public static List<Point> convexHull(List<Point> points) {
		Collections.sort(points);

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
