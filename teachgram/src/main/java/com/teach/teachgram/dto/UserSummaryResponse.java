package com.teach.teachgram.dto;

import com.teach.teachgram.model.User;

public record UserSummaryResponse(
    Long id,
    String name,
    String username,
    String profileLink,
    String bio
) {
    public static UserSummaryResponse fromEntity(User user) {
        return new UserSummaryResponse(
            user.getId(),
            user.getName(),
            user.getUserName(),
            user.getProfileLink(),
            user.getBio()
        );
    }
}
