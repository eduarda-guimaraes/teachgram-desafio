package com.teach.teachgram.repository;

import com.teach.teachgram.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Lista posts ativos de um usuário específico para a página de perfil
    List<Post> findByUserIdAndDeletedFalse(Long userId);
    
    // Lista posts ativos gerais para o Feed em ordem cronológica decrescente
    List<Post> findByDeletedFalseOrderByCreatedAtDesc();
}
