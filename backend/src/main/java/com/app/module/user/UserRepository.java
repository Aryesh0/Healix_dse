package com.app.module.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/** Spring Data MongoDB repository for User documents. */
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
