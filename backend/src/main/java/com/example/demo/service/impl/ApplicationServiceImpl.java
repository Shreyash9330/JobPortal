package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Application;
import com.example.demo.entity.Job;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.service.ApplicationService;

@Service
public class ApplicationServiceImpl implements ApplicationService {


    
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Override
    public Application applyJob(Application application) {

        application.setStatus("Applied");

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

        Application application =
                applicationRepository.findById(id).orElseThrow();

        application.setStatus(status);

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