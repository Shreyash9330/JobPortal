package com.shreyash.jobportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreyash.jobportal.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserEmail(String userEmail);
    List<Application> findByJobIdIn(List<Long> jobIds);
    boolean existsByJobIdAndUserEmail(Long jobId, String userEmail);
}