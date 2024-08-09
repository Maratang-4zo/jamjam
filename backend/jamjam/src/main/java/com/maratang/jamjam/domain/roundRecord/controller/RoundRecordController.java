package com.maratang.jamjam.domain.roundRecord.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordCreateReq;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordGetReq;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordUpdateReq;
import com.maratang.jamjam.domain.roundRecord.dto.response.RoundRecordGetRes;
import com.maratang.jamjam.domain.roundRecord.dto.response.RoundRecordUpdateRes;
import com.maratang.jamjam.domain.roundRecord.service.RoundRecordService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/roundRecord")
@RequiredArgsConstructor
public class RoundRecordController {

    private final RoundRecordService roundRecordService;

    @PostMapping
    @Operation(summary = "✨ 라운드 기록을 저장한다.", description = "라운드가 시작할때 저장한다. (만들어진 시간(시작시간)을 잰다)")
    public ResponseEntity<?> createRoundRecode(@RequestBody RoundRecordCreateReq roundRecodeCreateRequest) {
        roundRecordService.createRoundRecord(roundRecodeCreateRequest);

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PatchMapping
    @Operation(summary = "✨ 라운드 기록을 수정한다.", description = "라운드가 끝났을 때 결정된 역과 마지막 시간을 저장한다.")
    public ResponseEntity<?> updateRoundRecode(@RequestBody RoundRecordUpdateReq roundRecodeUpdateRequest) {
        RoundRecordUpdateRes roundRecordUpdateRes = roundRecordService.updateRoundRecord(roundRecodeUpdateRequest);

        return ResponseEntity.status(HttpStatus.OK).body(roundRecordUpdateRes);
    }

    @PostMapping("/find")
    @Operation(summary = "✨ 라운드 기록을 찾는다.", description = "현재 라운드 게임 기록의 라운드 별 기록을 찾는다.")
    public ResponseEntity<?> getRoundRecode(@RequestBody RoundRecordGetReq roundRecodeGetRequest) {
        RoundRecordGetRes roundRecordGetRes = roundRecordService.getRoundRecord(roundRecodeGetRequest);

        return ResponseEntity.status(HttpStatus.OK).body(roundRecordGetRes);
    }
}
