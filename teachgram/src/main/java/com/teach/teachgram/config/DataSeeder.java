package com.teach.teachgram.config;

import com.teach.teachgram.model.Post;
import com.teach.teachgram.model.User;
import com.teach.teachgram.repository.PostRepository;
import com.teach.teachgram.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(UserRepository userRepository, PostRepository postRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User maria = buildUser("Maria da Silva", "MariaDaSilva", "maria@teachgram.com", passwordEncoder, "11999990001",
                "O melhor de mim ainda está por vir.", "https://images.unsplash.com/photo-1494790108377-be9c29b29330");
            User bruno = buildUser("Bruno Prado", "brunoprado", "bruno@teachgram.com", passwordEncoder, "11999990002",
                "Durmo com ideias, acordo com atitudes.", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e");
            User carlos = buildUser("Carlos Tozeli", "carlostozeli", "carlos@teachgram.com", passwordEncoder, "11999990003",
                "Empresário apaixonado por educação.", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d");

            maria = userRepository.save(maria);
            bruno = userRepository.save(bruno);
            carlos = userRepository.save(carlos);

            maria.getFriends().add(bruno);
            bruno.getFriends().add(maria);
            bruno.getFriends().add(carlos);
            carlos.getFriends().add(bruno);

            maria = userRepository.save(maria);
            bruno = userRepository.save(bruno);
            carlos = userRepository.save(carlos);

            postRepository.save(buildPost(maria, "Planejamento da semana", "Hoje foi dia de organizar novas ideias para a turma.", false,
                "https://images.unsplash.com/photo-1517841905240-472988babdf9"));
            postRepository.save(buildPost(bruno, "Turma em ação", "Compartilhei um roteiro curto para dinâmicas colaborativas.", false,
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"));
            postRepository.save(buildPost(carlos, "Estudo silencioso", "Uma publicação privada para testar o fluxo de visibilidade.", true,
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"));
        };
    }

    private User buildUser(
        String name,
        String username,
        String email,
        PasswordEncoder passwordEncoder,
        String phone,
        String bio,
        String profileLink
    ) {
        User user = new User();
        user.setName(name);
        user.setUserName(username);
        user.setMail(email);
        user.setPassword(passwordEncoder.encode("123456"));
        user.setPhone(phone);
        user.setBio(bio);
        user.setProfileLink(profileLink);
        return user;
    }

    private Post buildPost(User user, String title, String description, boolean isPrivate, String photoLink) {
        Post post = new Post();
        post.setUser(user);
        post.setTitle(title);
        post.setDescription(description);
        post.setPhotoLink(photoLink);
        post.setIsPrivate(isPrivate);
        return post;
    }
}
