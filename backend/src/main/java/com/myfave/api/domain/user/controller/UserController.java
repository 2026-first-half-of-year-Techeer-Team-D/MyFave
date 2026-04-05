package com.myfave.api.domain.user.controller;

import com.myfave.api.domain.user.dto.response.UserResponse;
import com.myfave.api.domain.user.service.UserService;
import com.myfave.api.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.myfave.api.domain.user.dto.request.UserUpdateRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(
            @PathVariable Long userId) {

        UserResponse response = userService.getUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{userId}/edit")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long userId,
            @RequestBody @Valid UserUpdateRequest request) {

        UserResponse response = userService.updateUser(userId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "회원 정보가 수정되었습니다.", response));
    }
}