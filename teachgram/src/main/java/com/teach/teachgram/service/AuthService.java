package com.teach.teachgram.service;

import com.teach.teachgram.dto.AuthResponse;
import com.teach.teachgram.dto.LoginRequest;
import com.teach.teachgram.dto.RegisterRequest;
import com.teach.teachgram.dto.UserResponse;
import com.teach.teachgram.model.User;
import com.teach.teachgram.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        validateRegister(request);
        validateEmail(request.email());
        validateUniqueFields(null, request.username(), request.email(), request.phone());

        User user = new User();
        user.setName(request.name().trim());
        user.setUserName(request.username().trim());
        user.setMail(request.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password().trim()));
        user.setPhone(normalizeOptional(request.phone()));
        user.setBio(normalizeOptional(request.bio()));
        user.setProfileLink(normalizeOptional(request.profileLink()));

        User savedUser = userRepository.save(user);
        String token = buildBasicToken(savedUser.getMail(), request.password().trim());
        return new AuthResponse(token, UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        validateLogin(request);

        User user = userRepository.findByMail(request.email().trim().toLowerCase())
            .filter(foundUser -> !Boolean.TRUE.equals(foundUser.getDeleted()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos."));

        String rawPassword = request.password().trim();

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            // fallback: if the stored password is in plain text (from older data),
            // migrate it to encoded form on first successful match of raw equality
            if (user.getPassword() != null && user.getPassword().equals(rawPassword)) {
                user.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(user);
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos.");
            }
        }

        String token = buildBasicToken(user.getMail(), rawPassword);
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    public UserResponse meFromBasic(String authorizationHeader) {
        if (!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith("Basic ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Header Authorization ausente ou inválido.");
        }

        String base64 = authorizationHeader.substring(6).trim();
        byte[] decoded = Base64.getDecoder().decode(base64);
        String source = new String(decoded, StandardCharsets.UTF_8);
        int idx = source.indexOf(":");
        if (idx <= 0) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido.");
        }

        String email = source.substring(0, idx).trim().toLowerCase();
        String password = source.substring(idx + 1);

        User user = userRepository.findByMail(email)
            .filter(foundUser -> !Boolean.TRUE.equals(foundUser.getDeleted()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            if (user.getPassword() != null && user.getPassword().equals(password)) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos.");
            }
        }

        return UserResponse.fromEntity(user);
    }

    private void validateRegister(RegisterRequest request) {
        if (request == null
            || !StringUtils.hasText(request.name())
            || !StringUtils.hasText(request.username())
            || !StringUtils.hasText(request.email())
            || !StringUtils.hasText(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome, username, email e senha são obrigatórios.");
        }
    }

    private void validateLogin(LoginRequest request) {
        if (request == null || !StringUtils.hasText(request.email()) || !StringUtils.hasText(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email e senha são obrigatórios.");
        }
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

    private String buildBasicToken(String email, String password) {
        String source = email + ":" + password;
        return Base64.getEncoder().encodeToString(source.getBytes(StandardCharsets.UTF_8));
    }
}
