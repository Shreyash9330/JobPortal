package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.entity.EmployerProfile;

public interface EmployerService {

    EmployerProfile saveEmployer(EmployerProfile employer);

    List<EmployerProfile> getAllEmployers();

    EmployerProfile getEmployerById(Long id);

    void deleteEmployer(Long id);
    DashboardDTO getDashboard();
    EmployerProfile getEmployerByEmail(String email);
    EmployerProfile updateEmployer(Long id, EmployerProfile employer);
}