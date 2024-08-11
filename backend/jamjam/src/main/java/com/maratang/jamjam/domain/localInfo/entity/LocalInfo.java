package com.maratang.jamjam.domain.localInfo.entity;

import com.maratang.jamjam.global.auditing.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "local_info")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LocalInfo extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "local_info_id")
    private Integer localInfoId;

    @Column(name = "station_name", length = 255, nullable = true)
    private String stationName;

    @Column(name = "name", length = 255, nullable = true)
    private String name;

    @Column(name = "id", nullable = true)
    private Integer id;

    @Column(name = "category", length = 255, nullable = true)
    private String category;

    @Column(name = "road_address", length = 255, nullable = true)
    private String roadAddress;

    @Column(name = "address", length = 255, nullable = true)
    private String address;

    @Column(name = "phone", length = 20, nullable = true)
    private String phone;

    @Column(name = "latitude", nullable = true)
    private Float latitude;

    @Column(name = "longitude", nullable = true)
    private Float longitude;

    @Column(name = "is_deleted", nullable = true)
    private Boolean isDeleted = false;

    @Builder
    public LocalInfo(Integer localInfoId, String stationName, String name, Integer id, String category,
                     String roadAddress, String address, String phone, Float latitude, Float longitude,
                     Boolean isDeleted) {
        this.localInfoId = localInfoId;
        this.stationName = stationName;
        this.name = name;
        this.id = id;
        this.category = category;
        this.roadAddress = roadAddress;
        this.address = address;
        this.phone = phone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.isDeleted = isDeleted;
    }
}
