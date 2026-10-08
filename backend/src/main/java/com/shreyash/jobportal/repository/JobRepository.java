package com.shreyash.jobportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreyash.jobportal.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
	List<Job> findByEmployerEmail(String employerEmail);
	List<Job> findByLocation(String location);

	List<Job> findByJobType(String jobType);

	List<Job> findByExperience(String experience);

	List<Job> findByTitleContainingIgnoreCase(String title);
	
	}

