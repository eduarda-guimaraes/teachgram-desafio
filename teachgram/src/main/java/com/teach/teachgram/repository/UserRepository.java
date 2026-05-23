package com.teach.teachgram.repository;

import com.teach.teachgram.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByDeletedFalseOrderByNameAsc();

    Optional<User> findByIdAndDeletedFalse(Long id);

    Optional<User> findByUserName(String userName);

    Optional<User> findByMail(String mail);

    Optional<User> findByPhone(String phone);
}
