import java.util.List;

public class GeometryUtils {
	public static Point calculateCentroid(List<Point> points) {
		double sumX = 0;
		double sumY = 0;
		for (Point p : points) {
			sumX += p.x;
			sumY += p.y;
		}
		double centroidX = sumX / points.size();
		double centroidY = sumY / points.size();
		return new Point(centroidX, centroidY);
	}
}