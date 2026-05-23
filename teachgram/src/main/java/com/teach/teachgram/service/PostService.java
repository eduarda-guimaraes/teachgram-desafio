package com.teach.teachgram.service;

import com.teach.teachgram.dto.PostPrivacyRequest;
import com.teach.teachgram.dto.PostRequest;
import com.teach.teachgram.dto.PostResponse;
import com.teach.teachgram.model.Post;
import com.teach.teachgram.model.User;
import com.teach.teachgram.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserService userService;

    public PostService(PostRepository postRepository, UserService userService) {
        this.postRepository = postRepository;
        this.userService = userService;
    }

    public PostResponse create(Authentication authentication, PostRequest request) {
        User currentUser = userService.requireAuthenticatedUser(authentication);
        validateRequest(request);

        Post post = new Post();
        post.setUser(currentUser);
        applyRequest(post, request);
        return PostResponse.fromEntity(postRepository.save(post));
    }

    public List<PostResponse> getFeed(Authentication authentication) {
        User currentUser = userService.requireAuthenticatedUser(authentication);
        return postRepository.findByDeletedFalseOrderByCreatedAtDescIdDesc()
            .stream()
            .filter(post -> canViewPost(currentUser, post))
            .map(PostResponse::fromEntity)
            .toList();
    }

    public List<PostResponse> getPostsByUser(Authentication authentication, Long userId) {
        User currentUser = userService.requireAuthenticatedUser(authentication);
        return postRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDescIdDesc(userId)
            .stream()
            .filter(post -> canViewPost(currentUser, post))
            .map(PostResponse::fromEntity)
            .toList();
    }

    public PostResponse getById(Authentication authentication, Long postId) {
        User currentUser = userService.requireAuthenticatedUser(authentication);
        Post post = findActivePost(postId);

        if (!canViewPost(currentUser, post)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta publicação.");
        }

        return PostResponse.fromEntity(post);
    }

    public PostResponse update(Authentication authentication, Long postId, PostRequest request) {
        User currentUser = userService.requireAuthenticatedUser(authentication);
        Post post = findOwnedPost(postId, currentUser.getId());
        validateRequest(request);
        applyRequest(post, request);
        return PostResponse.fromEntity(postRepository.save(post));
    }

    public void delete(Authentication authentication, Long postId) {
        User currentUser = userService.requireAuthenticatedUser(authentication);
        Post post = findOwnedPost(postId, currentUser.getId());
        post.setDeleted(true);
        postRepository.save(post);
    }

    public PostResponse togglePrivacy(Authentication authentication, Long postId, PostPrivacyRequest request) {
        User currentUser = userService.requireAuthenticatedUser(authentication);
        Post post = findOwnedPost(postId, currentUser.getId());

        if (request == null || request.isPrivate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o valor de privacidade.");
        }

        post.setIsPrivate(request.isPrivate());
        return PostResponse.fromEntity(postRepository.save(post));
    }

    public PostResponse like(Authentication authentication, Long postId) {
        userService.requireAuthenticatedUser(authentication);
        Post post = findActivePost(postId);
        post.setLikesCount(post.getLikesCount() + 1);
        return PostResponse.fromEntity(postRepository.save(post));
    }

    private void validateRequest(PostRequest request) {
        if (request == null || !StringUtils.hasText(request.title()) || request.isPrivate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título e privacidade são obrigatórios.");
        }

        if (request.title().trim().length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O título deve ter no máximo 50 caracteres.");
        }

        if (StringUtils.hasText(request.description()) && request.description().trim().length() > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A descrição deve ter no máximo 200 caracteres.");
        }
    }

    private void applyRequest(Post post, PostRequest request) {
        post.setTitle(request.title().trim());
        post.setDescription(normalizeOptional(request.description()));
        post.setPhotoLink(normalizeOptional(request.photoLink()));
        post.setVideoLink(normalizeOptional(request.videoLink()));
        post.setIsPrivate(request.isPrivate());
    }

    private boolean canViewPost(User currentUser, Post post) {
        if (!Boolean.TRUE.equals(post.getIsPrivate())) {
            return true;
        }

        if (post.getUser().getId().equals(currentUser.getId())) {
            return true;
        }

        return currentUser.getFriends().stream()
            .anyMatch(friend -> friend.getId().equals(post.getUser().getId()));
    }

    private Post findActivePost(Long postId) {
        return postRepository.findByIdAndDeletedFalse(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post não encontrado."));
    }

    private Post findOwnedPost(Long postId, Long userId) {
        Post post = findActivePost(postId);
        if (!post.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode alterar suas próprias publicações.");
        }
        return post;
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
