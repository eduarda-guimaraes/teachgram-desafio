package com.teach.teachgram.dto;

public record LoginRequest(
    String email,
    String password
) {
}
