package com.shreyash.jobportal.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreyash.jobportal.entity.Application;
import com.shreyash.jobportal.entity.Job;
import com.shreyash.jobportal.enums.ApplicationStatus;
import com.shreyash.jobportal.exception.DuplicateResourceException;
import com.shreyash.jobportal.exception.ResourceNotFoundException;
import com.shreyash.jobportal.repository.ApplicationRepository;
import com.shreyash.jobportal.repository.JobRepository;
import com.shreyash.jobportal.service.ApplicationService;

@Service
public class ApplicationServiceImpl implements ApplicationService {


    
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Override
    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    @Override
    public Application applyJob(Application application) {

        jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + application.getJobId()));

        if (applicationRepository.existsByJobIdAndUserEmail(
                application.getJobId(), application.getUserEmail())) {
            throw new DuplicateResourceException("You have already applied for this job");
        }

        application.setStatus(ApplicationStatus.APPLIED);
        return applicationRepository.save(application);
    }

    @Override
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @Override
    public List<Application> getApplicationsByUser(String email) {
        return applicationRepository.findByUserEmail(email);
    }
    
    @Override
    public Application updateStatus(Long id, String status) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id));

        try {
            application.setStatus(ApplicationStatus.valueOf(status.trim().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        return applicationRepository.save(application);
    }
    
    @Override
    public List<Application> getApplicationsByEmployer(String employerEmail) {

        List<Job> jobs = jobRepository.findByEmployerEmail(employerEmail);

        List<Long> jobIds = jobs.stream()
                .map(Job::getId)
                .toList();

        return applicationRepository.findByJobIdIn(jobIds);
    }
    
    @Override
    public boolean hasApplied(Long jobId, String userEmail) {
        return applicationRepository.existsByJobIdAndUserEmail(jobId, userEmail);
    }
}