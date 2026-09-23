package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.entity.EmployerProfile;
import com.example.demo.repository.EmployerRepository;
import com.example.demo.service.EmployerService;

@Service
public class EmployerServiceImpl implements EmployerService {

    @Autowired
    private EmployerRepository employerRepository;

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
        return employerRepository.findById(id).orElse(null);
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
    public DashboardDTO getDashboard() {

        DashboardDTO dashboard = new DashboardDTO();

        dashboard.setTotalJobs(12);
        dashboard.setActiveJobs(8);
        dashboard.setApplications(54);
        dashboard.setRating(4.8);

        return dashboard;
    }
    
    @Override
    public EmployerProfile updateEmployer(Long id, EmployerProfile employer) {

        EmployerProfile existing =
                employerRepository.findById(id).orElseThrow();

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