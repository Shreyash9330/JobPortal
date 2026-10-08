package com.shreyash.jobportal.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreyash.jobportal.entity.Job;
import com.shreyash.jobportal.enums.JobStatus;
import com.shreyash.jobportal.enums.JobType;
import com.shreyash.jobportal.exception.ResourceNotFoundException;
import com.shreyash.jobportal.repository.JobRepository;
import com.shreyash.jobportal.service.JobService;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Override
    public Job addJob(Job job) {
        job.setStatus(JobStatus.ACTIVE);
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
        Job existing = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        existing.setTitle(job.getTitle());
        existing.setCompany(job.getCompany());
        existing.setDescription(job.getDescription());
        existing.setLocation(job.getLocation());
        existing.setSalary(job.getSalary());
        existing.setExperience(job.getExperience());
        existing.setSkills(job.getSkills());
        if (job.getJobType() != null) {
            existing.setJobType(job.getJobType());
        }

        return jobRepository.save(existing);
    }

    @Override
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
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
    public List<Job> filterJobs(String title, String location, String jobType, String experience) {

        List<Job> jobs = jobRepository.findAll();

        if (title != null && !title.isBlank()) {
            jobs = jobs.stream()
                    .filter(job -> job.getTitle() != null
                            && job.getTitle().toLowerCase().contains(title.toLowerCase()))
                    .toList();
        }

        if (location != null && !location.isBlank()) {
            jobs = jobs.stream()
                    .filter(job -> job.getLocation() != null
                            && job.getLocation().equalsIgnoreCase(location))
                    .toList();
        }

        if (jobType != null && !jobType.isBlank()) {
            JobType type = JobType.from(jobType);
            jobs = jobs.stream()
                    .filter(job -> job.getJobType() == type)
                    .toList();
        }

        if (experience != null && !experience.isBlank()) {
            jobs = jobs.stream()
                    .filter(job -> job.getExperience() != null
                            && job.getExperience().equalsIgnoreCase(experience))
                    .toList();
        }

        return jobs;
    }
}