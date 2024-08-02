package com.maratang.jamjam.global.station;

import lombok.Getter;

@Getter
public class Point implements Comparable<Point> {
	private double x;
	private double y;

	public Point(double x, double y) {
		this.x = x;
		this.y = y;
	}

	@Override
	public int compareTo(Point p) {
		if (this.y != p.y) {
			return Double.compare(this.y, p.y);
		} else {
			return Double.compare(this.x, p.x);
		}
	}

	public double distance(Point p) {
		return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
	}

	public static int ccw(Point a, Point b, Point c) {
		double area2 = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
		if (area2 > 0)
			return 1;
		else if (area2 < 0)
			return -1;
		else
			return 0;
	}

	@Override
	public String toString() {
		return "Longitude: " + x + ", Latitude: " + y;
	}
}
