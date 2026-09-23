package com.example.demo.service;

import com.example.demo.dto.EmployerRegisterDTO;
import com.example.demo.entity.EmployerProfile;

public interface EmployerRegistrationService {

	EmployerProfile registerEmployer(EmployerRegisterDTO employerDTO);

}