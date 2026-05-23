package com.teach.teachgram.dto;

import com.teach.teachgram.model.User;

public record UserResponse(
    Long id,
    String name,
    String username,
    String email,
    String phone,
    String bio,
    String profileLink,
    String createdAt,
    String updatedAt,
    Boolean deleted,
    int friendsCount
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getUserName(),
            user.getMail(),
            user.getPhone(),
            user.getBio(),
            user.getProfileLink(),
            user.getCreatedAt() == null ? null : user.getCreatedAt().toString(),
            user.getUpdatedAt() == null ? null : user.getUpdatedAt().toString(),
            user.getDeleted(),
            user.getFriends() == null ? 0 : user.getFriends().size()
        );
    }
}
