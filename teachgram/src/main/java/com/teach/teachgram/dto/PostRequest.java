package com.teach.teachgram.dto;

public record PostRequest(
    String title,
    String description,
    String photoLink,
    String videoLink,
    Boolean isPrivate
) {
}
