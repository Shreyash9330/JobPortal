package com.shreyash.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreyash.jobportal.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	

	Optional<User> findByEmail(String email);

}