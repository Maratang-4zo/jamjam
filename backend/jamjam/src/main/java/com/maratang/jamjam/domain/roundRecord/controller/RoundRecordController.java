package com.maratang.jamjam.domain.roundRecord.controller;

import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordCreateRequest;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordUpdateRequest;
import com.maratang.jamjam.domain.roundRecord.service.RoundRecordService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/roundRecord")
@RequiredArgsConstructor
public class RoundRecordController {

    private final RoundRecordService roundRecordService;

    @PostMapping
    @Operation(summary = "✨ 라운드 기록을 저장한다.", description = "라운드가 시작할때 저장한다. (만들어진 시간(시작시간)을 잰다)")
    public ResponseEntity<?> createRoundRecode(@PathVariable UUID roomUUID, @RequestBody RoundRecordCreateRequest roundRecodeCreateRequest) {
        roundRecordService.createRoundRecord(roundRecodeCreateRequest);

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PatchMapping("/{roomUUID}")
    @Operation(summary = "✨ 라운드 기록을 수정한다.", description = "라운드가 끝났을 때 결정된 역과 마지막 시간을 저장한다.")
    public ResponseEntity<?> updateRoundRecode(@PathVariable UUID roomUUID, @RequestBody RoundRecordUpdateRequest roundRecodeUpdateRequest) {
        roundRecordService.updateRoundRecord(roomUUID, roundRecodeUpdateRequest);

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
