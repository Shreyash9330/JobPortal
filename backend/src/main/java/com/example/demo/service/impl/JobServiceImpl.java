package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Job;
import com.example.demo.repository.JobRepository;
import com.example.demo.service.JobService;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Override
    public Job addJob(Job job) {

        job.setStatus("ACTIVE");

        return jobRepository.save(job);
    }

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
    
    @Override
    public List<Job> getJobsByEmployer(String employerEmail) {
        return jobRepository.findByEmployerEmail(employerEmail);
    }
    
    @Override
    public Job updateJob(Long id, Job job) {
        Job existing = jobRepository.findById(id).orElseThrow();

        existing.setTitle(job.getTitle());
        existing.setCompany(job.getCompany());
        existing.setDescription(job.getDescription());
        existing.setLocation(job.getLocation());
        existing.setSalary(job.getSalary());

        return jobRepository.save(existing);
    }
    
    @Override
    public Job getJobById(Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }
    
    @Override
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
    
    @Override
    public long getJobCount() {
        return jobRepository.count();
    }
    
    @Override
    public List<Job> filterJobs(
            String title,
            String location,
            String jobType,
            String experience) {

        List<Job> jobs = jobRepository.findAll();

        if (title != null && !title.isBlank()) {
            jobs = jobs.stream()
                    .filter(job -> job.getTitle() != null &&
                    		job.getTitle().toLowerCase().contains(title.toLowerCase()))
                    .toList();
        }

        if (location != null && !location.isBlank()) {
            jobs = jobs.stream()
                    .filter(job -> job.getLocation() != null &&
                    		job.getLocation().equalsIgnoreCase(location))
                    .toList();
        }

        if (jobType != null && !jobType.isBlank()) {
        	jobs = jobs.stream()
        		    .filter(job ->
        		        job.getJobType() != null &&
        		        job.getJobType().equalsIgnoreCase(jobType))
        		    .toList();;
        }

        if (experience != null && !experience.isBlank()) {
            jobs = jobs.stream()
                    .filter(job -> job.getExperience() != null &&
                    		job.getExperience().equalsIgnoreCase(experience))
                    .toList();
        }

        return jobs;
    }
}