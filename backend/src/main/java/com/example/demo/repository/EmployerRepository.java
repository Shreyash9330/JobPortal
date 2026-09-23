package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.EmployerProfile;

public interface EmployerRepository extends JpaRepository<EmployerProfile, Long> {

    Optional<EmployerProfile> findByUserEmail(String email);

}