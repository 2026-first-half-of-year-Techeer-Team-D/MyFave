package com.myfave.api.domain.content.controller;

import com.myfave.api.domain.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myfave.api.domain.content.dto.request.ContentRegisterRequest;
import com.myfave.api.domain.content.dto.response.ContentRegisterResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.myfave.api.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;
    // 9-3. 콘텐츠 등록 (Influencer)
    @PostMapping
    public ResponseEntity<ApiResponse<ContentRegisterResponse>> registerContent(
            @Valid @ModelAttribute ContentRegisterRequest request,
            @RequestParam("mediaFile") MultipartFile mediaFile,
            @RequestParam(value = "thumbnailFile", required = false) MultipartFile thumbnailFile) {

        ContentRegisterResponse response = contentService.registerContent(request, mediaFile, thumbnailFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("콘텐츠가 등록되었습니다.", response));
    }
}
