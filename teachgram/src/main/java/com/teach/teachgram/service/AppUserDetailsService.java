package com.teach.teachgram.service;

import com.teach.teachgram.model.User;
import com.teach.teachgram.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByMail(usernameOrEmail)
            .or(() -> userRepository.findByUserName(usernameOrEmail))
            .filter(foundUser -> !Boolean.TRUE.equals(foundUser.getDeleted()))
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getMail())
            .password(user.getPassword())
            .roles("USER")
            .build();
    }
}
