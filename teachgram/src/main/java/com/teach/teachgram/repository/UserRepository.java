package com.teach.teachgram.repository;

import com.teach.teachgram.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Busca usuários ativos (exclusão lógica)
    List<User> findByDeletedFalse();    
    // Métodos para validação no cadastro
    Optional<User> findByUserName(String userName);
    Optional<User> findByMail(String mail);
    Optional<User> findByPhone(String phone);
}