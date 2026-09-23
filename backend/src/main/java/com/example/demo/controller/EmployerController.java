package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.entity.EmployerProfile;
import com.example.demo.service.EmployerService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    @Autowired
    private EmployerService employerService;

    @PostMapping
    public EmployerProfile saveEmployer(@RequestBody EmployerProfile employer) {
        return employerService.saveEmployer(employer);
    }


    @GetMapping("/dashboard")
    public DashboardDTO getDashboard() {
        return employerService.getDashboard();
    }
    @GetMapping
    public List<EmployerProfile> getAllEmployers() {
        return employerService.getAllEmployers();
    }

    @GetMapping("/{id}")
    public EmployerProfile getEmployer(@PathVariable Long id) {
        return employerService.getEmployerById(id);
    }

    @PutMapping("/{id}")
    public EmployerProfile updateEmployer(
            @PathVariable Long id,
            @RequestBody EmployerProfile employer) {

        return employerService.updateEmployer(id, employer);
    }
    
    @GetMapping("/profile/{email}")
    public EmployerProfile getProfile(
            @PathVariable String email) {

        return employerService.getEmployerByEmail(email);
    }
    
    @DeleteMapping("/{id}")
    public String deleteEmployer(@PathVariable Long id) {

        employerService.deleteEmployer(id);

        return "Employer deleted successfully";
    }
}