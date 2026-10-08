package com.shreyash.jobportal.service;

import java.util.List;

import com.shreyash.jobportal.entity.Job;

public interface JobService {

    Job addJob(Job job);

    List<Job> getAllJobs();

    Job getJobById(Long id);

    Job updateJob(Long id, Job job);

    void deleteJob(Long id);
    
    long getJobCount();
    
    List<Job> filterJobs(
            String title,
            String location,
            String jobType,
            String experience);
    
    List<Job> getJobsByEmployer(String employerEmail);
    
    
}