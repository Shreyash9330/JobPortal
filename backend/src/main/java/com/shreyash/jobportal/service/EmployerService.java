package com.shreyash.jobportal.service;

import java.util.List;

import com.shreyash.jobportal.dto.DashboardDTO;
import com.shreyash.jobportal.entity.EmployerProfile;

public interface EmployerService {

    EmployerProfile saveEmployer(EmployerProfile employer);

    List<EmployerProfile> getAllEmployers();

    EmployerProfile getEmployerById(Long id);

    void deleteEmployer(Long id);
    DashboardDTO getDashboard();
    EmployerProfile getEmployerByEmail(String email);
    EmployerProfile updateEmployer(Long id, EmployerProfile employer);
}