package com.maratang.jamjam.global.error;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.maratang.jamjam.global.error.exception.BusinessException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<?> handleException(BusinessException e) {
		ErrorResponse response = ErrorResponse.of(e.getErrorCode());
		return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
		Throwable cause = ex.getCause();

		if (cause instanceof InvalidFormatException) {
			ErrorResponse response = ErrorResponse.of(ErrorCode.LF_FORMAT_NOT_MATCH);
			return ResponseEntity.status(ErrorCode.LF_FORMAT_NOT_MATCH.getStatus()).body(response);
		}

		ErrorResponse response = ErrorResponse.of(ErrorCode.BAD_REQUEST);
		return ResponseEntity.status(ErrorCode.BAD_REQUEST.getStatus()).body(response);
	}


	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleException(MethodArgumentNotValidException e) {
		Map<String, String> errors = new HashMap<>();
		for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
			errors.put(fieldError.getField(), fieldError.getDefaultMessage());
		}

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_PARAMETER, errors);

		return ResponseEntity.status(ErrorCode.INVALID_PARAMETER.getStatus()).body(response);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception e) {
		ErrorResponse response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);
		return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus()).body(response);
	}
}


