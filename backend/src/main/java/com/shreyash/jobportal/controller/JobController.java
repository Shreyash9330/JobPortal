package com.shreyash.jobportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shreyash.jobportal.entity.Job;
import com.shreyash.jobportal.security.AccessGuard;
import com.shreyash.jobportal.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

	 @Autowired
	    private JobService jobService;

	 @PostMapping
	 public Job addJob(@RequestBody Job job, Authentication auth) {
	     job.setEmployerEmail(auth.getName());
	     return jobService.addJob(job);
	 }
	 
	 @GetMapping("/count/employer/{email}")
	 public long getEmployerJobCount(@PathVariable String email, Authentication auth) {
	     AccessGuard.requireSelfOrAdmin(auth, email);
	     return jobService.getJobsByEmployer(email).size();
	 }
	 
	 @GetMapping("/employer/{email}")
	 public List<Job> getJobsByEmployer(@PathVariable String email, Authentication auth) {
	     AccessGuard.requireSelfOrAdmin(auth, email);
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
    public Job updateJob(@PathVariable Long id, @RequestBody Job job, Authentication auth) {
        Job existing = jobService.getJobById(id);
        AccessGuard.requireSelfOrAdmin(auth, existing.getEmployerEmail());
        return jobService.updateJob(id, job);
    }

    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id, Authentication auth) {
        Job existing = jobService.getJobById(id);
        AccessGuard.requireSelfOrAdmin(auth, existing.getEmployerEmail());
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