package com.shreyash.jobportal.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.shreyash.jobportal.dto.EmployerRegisterDTO;
import com.shreyash.jobportal.entity.EmployerProfile;
import com.shreyash.jobportal.entity.User;
import com.shreyash.jobportal.enums.Role;
import com.shreyash.jobportal.repository.EmployerRepository;
import com.shreyash.jobportal.repository.UserRepository;
import com.shreyash.jobportal.service.EmployerRegistrationService;

@Service
public class EmployerRegistrationServiceImpl
        implements EmployerRegistrationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public EmployerProfile registerEmployer(
            EmployerRegisterDTO dto) {

    	if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
    	    throw new RuntimeException("Email already exists");
    	}
        // Create User
        User user = new User();
        user.setName(dto.getHrName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.EMPLOYER);

        user = userRepository.save(user);

        // Create Employer Profile
        EmployerProfile employer = new EmployerProfile();
        employer.setCompanyName(dto.getCompanyName());
        employer.setHrName(dto.getHrName());
        employer.setPhone(dto.getPhone());
        employer.setWebsite(dto.getWebsite());
        employer.setIndustry(dto.getIndustry());
        employer.setCompanySize(dto.getCompanySize());

        employer.setUser(user);

        return employerRepository.save(employer);
    }
}