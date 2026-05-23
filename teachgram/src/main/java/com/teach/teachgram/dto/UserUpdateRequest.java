package com.teach.teachgram.dto;

public record UserUpdateRequest(
    String name,
    String username,
    String email,
    String phone,
    String bio,
    String profileLink,
    String password
) {
}
