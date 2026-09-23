package com.example.demo.controller;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Application;
import com.example.demo.service.ApplicationService;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;
    
    @GetMapping("/employer/{email}")
    public List<Application> getApplicationsByEmployer(
            @PathVariable String email) {
    

        return applicationService.getApplicationsByEmployer(email);
    }
    
    @GetMapping("/count/employer/{email}")
    public long getEmployerApplicationCount(
            @PathVariable String email) {

        return applicationService
                .getApplicationsByEmployer(email)
                .size();
    }
    
    @GetMapping("/resume/{fileName}")
    public ResponseEntity<Resource> viewResume(
            @PathVariable String fileName) throws Exception {

        Path path = Paths.get("C:/uploads/" + fileName);

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }
    
    @PostMapping
    public Application applyJob(@RequestBody Application application) {

        System.out.println("JOB TITLE RECEIVED = " + application.getJobTitle());

        return applicationService.applyJob(application);
    }

    @GetMapping
    public List<Application> getAllApplications() {

        return applicationService.getAllApplications();
    }

    @GetMapping("/user/{email}")
    public List<Application> getApplicationsByUser(
            @PathVariable String email) {

        return applicationService.getApplicationsByUser(email);
    }
    
    @PutMapping("/{id}/status")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService.updateStatus(id, status);
    }
    
    @GetMapping("/count")
    public long getApplicationCount() {
        return applicationService.getAllApplications().size();
    }
    
    @PostMapping("/upload")
    public String uploadResume(
            @RequestParam("file") MultipartFile file)
            throws Exception {

        String uploadDir = "C:/uploads/";

        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }

       
        
        String fileName = file.getOriginalFilename();

        File destination = new File(dir, fileName);
        
        System.out.println("Current Dir = " + System.getProperty("user.dir"));
        System.out.println("Upload Dir = " + dir.getAbsolutePath());
        
        file.transferTo(destination);

        return fileName;
    }
    
    @GetMapping("/check")
    public boolean hasApplied(
            @RequestParam Long jobId,
            @RequestParam String email) {

        return applicationService.hasApplied(jobId, email);
    }
}