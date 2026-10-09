package com.shreyash.jobportal.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreyash.jobportal.dto.DashboardDTO;
import com.shreyash.jobportal.entity.EmployerProfile;
import com.shreyash.jobportal.entity.Job;
import com.shreyash.jobportal.enums.JobStatus;
import com.shreyash.jobportal.exception.ResourceNotFoundException;
import com.shreyash.jobportal.repository.ApplicationRepository;
import com.shreyash.jobportal.repository.EmployerRepository;
import com.shreyash.jobportal.repository.JobRepository;
import com.shreyash.jobportal.service.EmployerService;

@Service
public class EmployerServiceImpl implements EmployerService {

    @Autowired
    private EmployerRepository employerRepository;
    
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Override
    public EmployerProfile saveEmployer(EmployerProfile employer) {
        return employerRepository.save(employer);
    }

    @Override
    public List<EmployerProfile> getAllEmployers() {
        return employerRepository.findAll();
    }

    @Override
    public EmployerProfile getEmployerById(Long id) {
        return employerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with id: " + id));
    }

    @Override
    public void deleteEmployer(Long id) {
        employerRepository.deleteById(id);
    }
    
    @Override
    public EmployerProfile getEmployerByEmail(String email) {

        return employerRepository
                .findByUserEmail(email)
                .orElse(null);
    }
    
    @Override
    public DashboardDTO getDashboard(String email) {
        List<Job> jobs = jobRepository.findByEmployerEmail(email);
        List<Long> jobIds = jobs.stream().map(Job::getId).toList();

        int active = (int) jobs.stream()
                .filter(j -> j.getStatus() == JobStatus.ACTIVE)
                .count();
        int applications = jobIds.isEmpty()
                ? 0
                : applicationRepository.findByJobIdIn(jobIds).size();

        DashboardDTO dashboard = new DashboardDTO();
        dashboard.setTotalJobs(jobs.size());
        dashboard.setActiveJobs(active);
        dashboard.setApplications(applications);
        dashboard.setRating(0.0);
        return dashboard;
    }
    
    @Override
    public EmployerProfile updateEmployer(Long id, EmployerProfile employer) {
        EmployerProfile existing = employerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with id: " + id));

        existing.setCompanyName(employer.getCompanyName());
        existing.setHrName(employer.getHrName());
        existing.setPhone(employer.getPhone());
        existing.setWebsite(employer.getWebsite());
        existing.setIndustry(employer.getIndustry());
        existing.setCompanySize(employer.getCompanySize());
        existing.setDescription(employer.getDescription());

        return employerRepository.save(existing);
    }
}