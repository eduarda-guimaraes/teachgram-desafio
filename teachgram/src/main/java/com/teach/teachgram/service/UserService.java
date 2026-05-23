package com.teach.teachgram.service;

import com.teach.teachgram.dto.UserResponse;
import com.teach.teachgram.dto.UserSummaryResponse;
import com.teach.teachgram.dto.UserUpdateRequest;
import com.teach.teachgram.model.User;
import com.teach.teachgram.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> listActiveUsers() {
        return userRepository.findByDeletedFalseOrderByNameAsc()
            .stream()
            .map(UserResponse::fromEntity)
            .toList();
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        return UserResponse.fromEntity(requireAuthenticatedUser(authentication));
    }

    public UserResponse getUserById(Long id) {
        return UserResponse.fromEntity(findActiveUser(id));
    }

    public List<UserSummaryResponse> getCurrentUserFriends(Authentication authentication) {
        User currentUser = requireAuthenticatedUser(authentication);
        return currentUser.getFriends()
            .stream()
            .filter(friend -> !Boolean.TRUE.equals(friend.getDeleted()))
            .sorted(Comparator.comparing(User::getName, String.CASE_INSENSITIVE_ORDER))
            .map(UserSummaryResponse::fromEntity)
            .toList();
    }

    public UserResponse updateCurrentUser(Authentication authentication, UserUpdateRequest request) {
        User user = requireAuthenticatedUser(authentication);

        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados para atualização não foram enviados.");
        }

        if (!StringUtils.hasText(request.name())
            || !StringUtils.hasText(request.username())
            || !StringUtils.hasText(request.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome, username e email são obrigatórios.");
        }

        validateEmail(request.email());
        validateUniqueFields(user.getId(), request.username(), request.email(), request.phone());

        user.setName(request.name().trim());
        user.setUserName(request.username().trim());
        user.setMail(request.email().trim().toLowerCase());
        user.setPhone(normalizeOptional(request.phone()));
        user.setBio(normalizeOptional(request.bio()));
        user.setProfileLink(normalizeOptional(request.profileLink()));

        if (StringUtils.hasText(request.password())) {
            user.setPassword(passwordEncoder.encode(request.password().trim()));
        }

        return UserResponse.fromEntity(userRepository.save(user));
    }

    public void deleteCurrentUser(Authentication authentication) {
        User user = requireAuthenticatedUser(authentication);
        user.setDeleted(true);
        userRepository.save(user);
    }

    public UserResponse addFriend(Authentication authentication, Long friendId) {
        User currentUser = requireAuthenticatedUser(authentication);
        User friend = findActiveUser(friendId);

        if (currentUser.getId().equals(friend.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não pode adicionar a si mesmo.");
        }

        currentUser.getFriends().add(friend);
        friend.getFriends().add(currentUser);
        userRepository.save(currentUser);
        userRepository.save(friend);
        return UserResponse.fromEntity(currentUser);
    }

    public User requireAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !StringUtils.hasText(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado.");
        }

        return userRepository.findByMail(authentication.getName())
            .filter(user -> !Boolean.TRUE.equals(user.getDeleted()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado."));
    }

    private User findActiveUser(Long id) {
        return userRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    private void validateUniqueFields(Long currentUserId, String username, String email, String phone) {
        userRepository.findByUserName(username.trim())
            .filter(user -> !user.getId().equals(currentUserId))
            .ifPresent(user -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username já está em uso.");
            });

        userRepository.findByMail(email.trim().toLowerCase())
            .filter(user -> !user.getId().equals(currentUserId))
            .ifPresent(user -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já está em uso.");
            });

        if (StringUtils.hasText(phone)) {
            userRepository.findByPhone(phone.trim())
                .filter(user -> !user.getId().equals(currentUserId))
                .ifPresent(user -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Telefone já está em uso.");
                });
        }
    }

    private void validateEmail(String email) {
        if (!StringUtils.hasText(email) || !email.contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um email válido.");
        }
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
