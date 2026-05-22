package com.teach.teachgram.service;

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

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {
        validateRegister(request);

        userRepository.findByUserName(request.username())
            .ifPresent(user -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already in use");
            });

        userRepository.findByMail(request.email())
            .ifPresent(user -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
            });

        User user = new User();
        user.setName(request.name().trim());
        user.setUserName(request.username().trim());
        user.setMail(request.email().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setBio(request.bio());
        user.setProfileLink(request.profileLink());

        return UserResponse.fromEntity(userRepository.save(user));
    }

    public UserResponse login(LoginRequest request) {
        validateLogin(request);

        User user = userRepository.findByMail(request.email().trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        return UserResponse.fromEntity(user);
    }

    private void validateLogin(LoginRequest request) {
        if (request == null || !StringUtils.hasText(request.email()) || !StringUtils.hasText(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }
    }

    private void validateRegister(RegisterRequest request) {
        if (request == null
            || !StringUtils.hasText(request.name())
            || !StringUtils.hasText(request.username())
            || !StringUtils.hasText(request.email())
            || !StringUtils.hasText(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, username, email and password are required");
        }
    }
}
