package com.teach.teachgram.repository;

import com.teach.teachgram.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByDeletedFalseOrderByCreatedAtDescIdDesc();

    List<Post> findByUserIdAndDeletedFalseOrderByCreatedAtDescIdDesc(Long userId);

    Optional<Post> findByIdAndDeletedFalse(Long id);
}
