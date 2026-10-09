package com.shreyash.jobportal.service;

import java.util.List;

import com.shreyash.jobportal.entity.Application;

public interface ApplicationService {

    Application applyJob(Application application);

    List<Application> getAllApplications();

    List<Application> getApplicationsByUser(String email);

    Application updateStatus(Long id, String status);
    
    Application getApplicationById(Long id);
    
    List<Application> getApplicationsByEmployer(String employerEmail);
    boolean hasApplied(Long jobId, String userEmail);
}