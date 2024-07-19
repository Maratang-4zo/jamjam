import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Stack;

class Point {
	double latitude, longitude;

	Point(double latitude, double longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
}

public class ConvexHullAndCentroid {
	// Helper method to find the orientation of the triplet (p, q, r).
	// Returns 0 if p, q and r are collinear, 1 if clockwise, -1 if counterclockwise
	public static int orientation(Point p, Point q, Point r) {
		double val = (q.longitude - p.longitude) * (r.latitude - q.latitude) -
			(q.latitude - p.latitude) * (r.longitude - q.longitude);
		if (val == 0.0)
			return 0;
		return (val > 0.0) ? 1 : -1;
	}

	// A utility function to swap two points
	public static void swap(Point[] points, int i, int j) {
		Point temp = points[i];
		points[i] = points[j];
		points[j] = temp;
	}

	// The function to find the convex hull using Graham's scan algorithm
	public static List<Point> grahamScan(Point[] points) {
		int n = points.length;

		// Find the bottom-most point
		int ymin = 0;
		for (int i = 1; i < n; i++) {
			if (points[i].latitude < points[ymin].latitude ||
				(points[i].latitude == points[ymin].latitude && points[i].longitude < points[ymin].longitude)) {
				ymin = i;
			}
		}

		// Place the bottom-most point at the first position
		swap(points, 0, ymin);

		// Sort the remaining points based on the polar angle with the first point
		Point p0 = points[0];
		Arrays.sort(points, 1, n, new Comparator<Point>() {
			public int compare(Point p1, Point p2) {
				int o = orientation(p0, p1, p2);
				if (o == 0)
					return Double.compare(distance(p0, p1), distance(p0, p2));
				return (o == -1) ? -1 : 1;
			}
		});

		// Create an empty stack and push the first three points to it
		Stack<Point> stack = new Stack<>();
		stack.push(points[0]);
		stack.push(points[1]);
		stack.push(points[2]);

		// Process the remaining n-3 points
		for (int i = 3; i < n; i++) {
			while (stack.size() > 1 && orientation(secondTop(stack), stack.peek(), points[i]) != -1)
				stack.pop();
			stack.push(points[i]);
		}

		return new ArrayList<>(stack);
	}

	// A utility function to return the distance between two points
	public static double distance(Point p1, Point p2) {
		return (p1.latitude - p2.latitude) * (p1.latitude - p2.latitude) +
			(p1.longitude - p2.longitude) * (p1.longitude - p2.longitude);
	}

	// A utility function to return the second top of the stack
	public static Point secondTop(Stack<Point> stack) {
		Point top = stack.pop();
		Point secondTop = stack.peek();
		stack.push(top);
		return secondTop;
	}

	// Function to find the centroid of a polygon
	public static Point findCentroid(List<Point> points) {
		double signedArea = 0;
		double Cx = 0;
		double Cy = 0;
		int n = points.size();

		for (int i = 0; i < n; i++) {
			double x0 = points.get(i).latitude;
			double y0 = points.get(i).longitude;
			double x1 = points.get((i + 1) % n).latitude;
			double y1 = points.get((i + 1) % n).longitude;
			double A = x0 * y1 - x1 * y0;
			signedArea += A;
			Cx += (x0 + x1) * A;
			Cy += (y0 + y1) * A;
		}

		signedArea *= 0.5;
		Cx /= (6.0 * signedArea);
		Cy /= (6.0 * signedArea);

		return new Point(Cx, Cy);
	}

	public static void main(String[] args) {
		Point[] points = {
			new Point(1.0, 1.0),
			new Point(2.0, 5.0),
			new Point(3.0, 3.0),
			new Point(5.0, 3.0),
			new Point(3.0, 2.0),
			new Point(2.0, 2.0)
		};

		List<Point> convexHull = grahamScan(points);
		Point centroid = findCentroid(convexHull);

		System.out.println("Convex Hull:");
		for (Point p : convexHull) {
			System.out.println("(" + p.latitude + ", " + p.longitude + ")");
		}

		System.out.println("Centroid: (" + centroid.latitude + ", " + centroid.longitude + ")");
	}
}
