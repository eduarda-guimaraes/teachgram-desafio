package com.teach.teachgram.dto;

import com.teach.teachgram.model.Post;

public record PostResponse(
    Long id,
    String title,
    String description,
    String photoLink,
    String videoLink,
    Boolean isPrivate,
    Integer likesCount,
    String createdAt,
    String updatedAt,
    Boolean deleted,
    UserSummaryResponse user
) {
    public static PostResponse fromEntity(Post post) {
        return new PostResponse(
            post.getId(),
            post.getTitle(),
            post.getDescription(),
            post.getPhotoLink(),
            post.getVideoLink(),
            post.getIsPrivate(),
            post.getLikesCount(),
            post.getCreatedAt() == null ? null : post.getCreatedAt().toString(),
            post.getUpdatedAt() == null ? null : post.getUpdatedAt().toString(),
            post.getDeleted(),
            UserSummaryResponse.fromEntity(post.getUser())
        );
    }
}
