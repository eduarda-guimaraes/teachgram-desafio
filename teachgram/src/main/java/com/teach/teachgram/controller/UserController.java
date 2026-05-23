package com.teach.teachgram.controller;

import com.teach.teachgram.dto.UserResponse;
import com.teach.teachgram.dto.UserSummaryResponse;
import com.teach.teachgram.dto.UserUpdateRequest;
import com.teach.teachgram.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers() {
        return ResponseEntity.ok(userService.listActiveUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUser(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> update(Authentication authentication, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateCurrentUser(authentication, request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> delete(Authentication authentication) {
        userService.deleteCurrentUser(authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{friendId}/friends")
    public ResponseEntity<UserResponse> addFriend(Authentication authentication, @PathVariable Long friendId) {
        return ResponseEntity.ok(userService.addFriend(authentication, friendId));
    }

    @GetMapping("/me/friends")
    public ResponseEntity<List<UserSummaryResponse>> getFriends(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUserFriends(authentication));
    }
}
