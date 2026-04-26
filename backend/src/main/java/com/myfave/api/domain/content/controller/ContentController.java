package com.myfave.api.domain.content.controller;

import com.myfave.api.domain.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myfave.api.domain.content.dto.response.StyleFeedResponse;
import org.springframework.data.domain.Page;

import com.myfave.api.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/content")
@RequiredArgsConstructor
@Validated
public class ContentController {

    private final ContentService contentService;
    // 9-2. 스타일 피드 목록 조회
    @GetMapping("/style-feeds")
    public ResponseEntity<ApiResponse<Page<StyleFeedResponse>>> getStyleFeeds(
            @RequestParam(defaultValue = "0") int page,
            @Min(1) @RequestParam(defaultValue = "12") int size) {
        Page<StyleFeedResponse> response = contentService.getStyleFeeds(page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
