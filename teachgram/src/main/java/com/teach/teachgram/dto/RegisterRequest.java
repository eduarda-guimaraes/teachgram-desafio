package com.teach.teachgram.dto;

public record RegisterRequest(
    String name,
    String username,
    String email,
    String password,
    String phone,
    String bio,
    String profileLink
) {
}
