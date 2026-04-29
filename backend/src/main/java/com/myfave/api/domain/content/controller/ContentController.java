package com.myfave.api.domain.content.controller;

import com.myfave.api.domain.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myfave.api.domain.content.dto.response.ShortFormResponse;
import com.myfave.api.domain.content.entity.ShortFormType;
import com.myfave.api.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@RestController
@RequestMapping("/content")
@RequiredArgsConstructor
@Validated
public class ContentController {

    private final ContentService contentService;

    // 9-1. 숏폼 목록 조회
    @GetMapping("/short-forms")
    public ResponseEntity<ApiResponse<List<ShortFormResponse>>> getShortForms(
            @RequestParam(required = false) ShortFormType type,
            @Min(1) @RequestParam(defaultValue = "10") int size) {
        List<ShortFormResponse> response = contentService.getShortForms(type, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
