package com.shreyash.jobportal.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shreyash.jobportal.entity.Application;
import com.shreyash.jobportal.exception.ResourceNotFoundException;
import com.shreyash.jobportal.service.ApplicationService;

import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;
    
    @Value("${app.upload-dir}")
    private String uploadDir;
    
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
    public ResponseEntity<Resource> viewResume(@PathVariable String fileName) throws Exception {

        Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = baseDir.resolve(fileName).normalize();

        if (!filePath.startsWith(baseDir) || !Files.exists(filePath)) {
            throw new ResourceNotFoundException("Resume not found");
        }

        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
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
    public String uploadResume(@RequestParam("file") MultipartFile file) throws Exception {

        String original = file.getOriginalFilename();
        if (file.isEmpty() || original == null || !original.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(baseDir);

        String savedName = UUID.randomUUID() + ".pdf";
        Files.copy(file.getInputStream(), baseDir.resolve(savedName),
                StandardCopyOption.REPLACE_EXISTING);

        return savedName;
    }
    
    @GetMapping("/check")
    public boolean hasApplied(
            @RequestParam Long jobId,
            @RequestParam String email) {

        return applicationService.hasApplied(jobId, email);
    }
}