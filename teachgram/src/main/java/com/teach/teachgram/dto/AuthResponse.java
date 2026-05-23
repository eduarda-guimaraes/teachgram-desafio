package com.teach.teachgram.dto;

public record AuthResponse(
    String token,
    UserResponse user
) {
}
