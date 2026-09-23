package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Job;
import com.example.demo.service.JobService;
import com.example.demo.repository.JobRepository;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

	 @Autowired
	    private JobService jobService;

    @PostMapping
    public Job addJob(@RequestBody Job job) {
        return jobService.addJob(job);
    }
    
    @GetMapping("/count/employer/{email}")
    public long getEmployerJobCount(@PathVariable String email) {
        return jobService.getJobsByEmployer(email).size();
    }

    @GetMapping("/employer/{email}")
    public List<Job> getJobsByEmployer(@PathVariable String email) {
        return jobService.getJobsByEmployer(email);
    }
    
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }
    
    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {

        return jobService.getJobById(id);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id,
                         @RequestBody Job job) {

        return jobService.updateJob(id, job);
    }

    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {

        jobService.deleteJob(id);
        return "Job deleted successfully";
    }
    
    
    
    @GetMapping("/count")
    public long getJobCount() {
        return jobService.getJobCount();
    }
    
    @GetMapping("/filter")
    public List<Job> filterJobs(

            @RequestParam(required = false) String title,

            @RequestParam(required = false) String location,

            @RequestParam(required = false) String jobType,

            @RequestParam(required = false) String experience) {

        return jobService.filterJobs(
                title,
                location,
                jobType,
                experience);
    }
   
}