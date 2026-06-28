package com.myfave.api.domain.content.controller;

import com.myfave.api.domain.content.service.ContentService;
import com.myfave.api.domain.content.dto.request.ContentRegisterRequest;
import com.myfave.api.domain.content.dto.response.ContentRegisterResponse;
import com.myfave.api.domain.content.dto.response.StyleFeedResponse;
import com.myfave.api.domain.content.dto.response.ShortFormResponse;
import com.myfave.api.domain.content.entity.ShortFormType;
import com.myfave.api.global.common.ApiResponse;
import com.myfave.api.global.common.CursorResponse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/content")
@RequiredArgsConstructor
@Validated
public class ContentController {

    private final ContentService contentService;

    // 9-1. 숏폼 목록 조회 (커서 페이징, cursor 미지정 시 첫 페이지)
    @GetMapping("/short-forms")
    public ResponseEntity<ApiResponse<CursorResponse<ShortFormResponse>>> getShortForms(
            @RequestParam(required = false) ShortFormType type,
            @RequestParam(required = false) Long cursor,
            @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        CursorResponse<ShortFormResponse> response = contentService.getShortForms(type, cursor, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // 9-2. 스타일 피드 목록 조회 (커서 페이징, cursor 미지정 시 첫 페이지)
    @GetMapping("/style-feeds")
    public ResponseEntity<ApiResponse<CursorResponse<StyleFeedResponse>>> getStyleFeeds(
            @RequestParam(required = false) Long cursor,
            @Min(1) @Max(100) @RequestParam(defaultValue = "12") int size) {
        CursorResponse<StyleFeedResponse> response = contentService.getStyleFeeds(cursor, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // 9-3. 콘텐츠 등록 (Influencer)
    @PostMapping
    public ResponseEntity<ApiResponse<ContentRegisterResponse>> registerContent(
            @AuthenticationPrincipal Long userId,
            @Valid @ModelAttribute ContentRegisterRequest request,
            @RequestParam("mediaFile") MultipartFile mediaFile,
            @RequestParam(value = "thumbnailFile", required = false) MultipartFile thumbnailFile) {
        ContentRegisterResponse response = contentService.registerContent(userId, request, mediaFile, thumbnailFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("콘텐츠가 등록되었습니다.", response));
    }
}