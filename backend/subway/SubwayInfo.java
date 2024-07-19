import java.util.ArrayList;
import java.util.List;

public class SubwayInfo {
    String name;
    Double latitude;
    Double longitude;
    RegionType region;
    List<SubwayLine> subwayLines;

    public SubwayInfo(String name, Double latitude, Double longitude, RegionType region, SubwayLine subwayLine) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.region = region;
        this.subwayLines = new ArrayList<>();
        this.subwayLines.add(subwayLine);
    }

    public void addSubwayLine(SubwayLine subwayLine) {
        this.subwayLines.add(subwayLine);
    }

    // Getters and setters (if needed)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public RegionType getRegion() {
        return region;
    }

    public void setRegion(RegionType region) {
        this.region = region;
    }

    public List<SubwayLine> getSubwayLines() {
        return subwayLines;
    }

    public void setSubwayLines(List<SubwayLine> subwayLines) {
        this.subwayLines = subwayLines;
    }
}
