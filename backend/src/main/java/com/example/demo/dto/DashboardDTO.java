package com.example.demo.dto;

public class DashboardDTO {

    private long totalJobs;
    private long activeJobs;
    private long applications;
    private double rating;

    public DashboardDTO() {
    }

    public DashboardDTO(long totalJobs, long activeJobs, long applications, double rating) {
        this.totalJobs = totalJobs;
        this.activeJobs = activeJobs;
        this.applications = applications;
        this.rating = rating;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public long getApplications() {
        return applications;
    }

    public void setApplications(long applications) {
        this.applications = applications;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}