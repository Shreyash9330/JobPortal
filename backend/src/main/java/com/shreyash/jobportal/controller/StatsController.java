package com.shreyash.jobportal.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shreyash.jobportal.repository.ApplicationRepository;
import com.shreyash.jobportal.repository.EmployerRepository;
import com.shreyash.jobportal.repository.JobRepository;
import com.shreyash.jobportal.repository.UserRepository;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserRepository users;
    private final EmployerRepository employers;
    private final JobRepository jobs;
    private final ApplicationRepository applications;

    public StatsController(UserRepository users, EmployerRepository employers,
                           JobRepository jobs, ApplicationRepository applications) {
        this.users = users;
        this.employers = employers;
        this.jobs = jobs;
        this.applications = applications;
    }

    @GetMapping
    public Map<String, Long> stats() {
        return Map.of(
            "users", users.count(),
            "employers", employers.count(),
            "jobs", jobs.count(),
            "applications", applications.count());
    }
}