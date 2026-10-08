package com.shreyash.jobportal.entity;

import com.shreyash.jobportal.enums.JobStatus;
import com.shreyash.jobportal.enums.JobType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Job extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;
    private String salary;
    private String experience;

    @Enumerated(EnumType.STRING)
    private JobType jobType;

    private String skills;
    private String description;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    private String employerEmail;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public String getEmployerEmail() { return employerEmail; }
    public void setEmployerEmail(String employerEmail) { this.employerEmail = employerEmail; }
}