package com.teach.teachgram.controller;

import com.teach.teachgram.dto.PostPrivacyRequest;
import com.teach.teachgram.dto.PostRequest;
import com.teach.teachgram.dto.PostResponse;
import com.teach.teachgram.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> create(Authentication authentication, @RequestBody PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(authentication, request));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getFeed(Authentication authentication) {
        return ResponseEntity.ok(postService.getFeed(authentication));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getById(Authentication authentication, @PathVariable Long postId) {
        return ResponseEntity.ok(postService.getById(authentication, postId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getByUser(Authentication authentication, @PathVariable Long userId) {
        return ResponseEntity.ok(postService.getPostsByUser(authentication, userId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> update(
        Authentication authentication,
        @PathVariable Long postId,
        @RequestBody PostRequest request
    ) {
        return ResponseEntity.ok(postService.update(authentication, postId, request));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long postId) {
        postService.delete(authentication, postId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{postId}/privacy")
    public ResponseEntity<PostResponse> togglePrivacy(
        Authentication authentication,
        @PathVariable Long postId,
        @RequestBody PostPrivacyRequest request
    ) {
        return ResponseEntity.ok(postService.togglePrivacy(authentication, postId, request));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponse> like(Authentication authentication, @PathVariable Long postId) {
        return ResponseEntity.ok(postService.like(authentication, postId));
    }
}
