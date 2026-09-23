package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.Application;

public interface ApplicationService {

    Application applyJob(Application application);

    List<Application> getAllApplications();

    List<Application> getApplicationsByUser(String email);

    Application updateStatus(Long id, String status);
    
    List<Application> getApplicationsByEmployer(String employerEmail);
    boolean hasApplied(Long jobId, String userEmail);
}