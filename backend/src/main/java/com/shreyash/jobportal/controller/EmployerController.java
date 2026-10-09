package com.shreyash.jobportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shreyash.jobportal.dto.DashboardDTO;
import com.shreyash.jobportal.entity.EmployerProfile;
import com.shreyash.jobportal.security.AccessGuard;
import com.shreyash.jobportal.service.EmployerService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    @Autowired
    private EmployerService employerService;

    private static String ownerEmail(EmployerProfile profile) {
        return profile.getUser() != null ? profile.getUser().getEmail() : null;
    }

    @PostMapping
    public EmployerProfile saveEmployer(@RequestBody EmployerProfile employer) {
        return employerService.saveEmployer(employer);
    }

    @GetMapping("/dashboard")
    public DashboardDTO getDashboard(Authentication auth) {
        return employerService.getDashboard(auth.getName());
    }

    @GetMapping
    public List<EmployerProfile> getAllEmployers() {
        return employerService.getAllEmployers();
    }

    @GetMapping("/{id}")
    public EmployerProfile getEmployer(@PathVariable Long id, Authentication auth) {
        EmployerProfile profile = employerService.getEmployerById(id);
        AccessGuard.requireSelfOrAdmin(auth, ownerEmail(profile));
        return profile;
    }

    @PutMapping("/{id}")
    public EmployerProfile updateEmployer(@PathVariable Long id,
                                          @RequestBody EmployerProfile employer,
                                          Authentication auth) {
        EmployerProfile existing = employerService.getEmployerById(id);
        AccessGuard.requireSelfOrAdmin(auth, ownerEmail(existing));
        return employerService.updateEmployer(id, employer);
    }

    @GetMapping("/profile/{email}")
    public EmployerProfile getProfile(@PathVariable String email, Authentication auth) {
        AccessGuard.requireSelfOrAdmin(auth, email);
        return employerService.getEmployerByEmail(email);
    }

    @DeleteMapping("/{id}")
    public String deleteEmployer(@PathVariable Long id) {
        employerService.deleteEmployer(id);
        return "Employer deleted successfully";
    }
}