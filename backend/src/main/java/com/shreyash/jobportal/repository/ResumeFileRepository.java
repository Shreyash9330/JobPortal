package com.shreyash.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreyash.jobportal.entity.ResumeFile;

public interface ResumeFileRepository extends JpaRepository<ResumeFile, String> {
}
