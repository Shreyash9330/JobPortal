package com.shreyash.jobportal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreyash.jobportal.entity.EmployerProfile;

public interface EmployerRepository extends JpaRepository<EmployerProfile, Long> {

    Optional<EmployerProfile> findByUserEmail(String email);

}