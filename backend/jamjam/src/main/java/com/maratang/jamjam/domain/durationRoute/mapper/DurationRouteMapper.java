package com.maratang.jamjam.domain.durationRoute.mapper;

import com.maratang.jamjam.domain.durationRoute.dto.DurationRouteCreateDTO;
import com.maratang.jamjam.domain.durationRoute.entity.DurationRoute;
import org.mapstruct.factory.Mappers;

public interface DurationRouteMapper {
    DurationRouteMapper INSTANCE = Mappers.getMapper(DurationRouteMapper.class);

    DurationRoute durationRouteCreateDTOToDurationRoute(DurationRouteCreateDTO durationRouteCreateDTO);
}
