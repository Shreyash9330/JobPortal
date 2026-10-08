package com.shreyash.jobportal.service;

import com.shreyash.jobportal.dto.EmployerRegisterDTO;
import com.shreyash.jobportal.entity.EmployerProfile;

public interface EmployerRegistrationService {

	EmployerProfile registerEmployer(EmployerRegisterDTO employerDTO);

}