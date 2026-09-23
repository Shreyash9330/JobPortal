package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.EmployerRegisterDTO;
import com.example.demo.entity.EmployerProfile;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.EmployerRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmployerRegistrationService;

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