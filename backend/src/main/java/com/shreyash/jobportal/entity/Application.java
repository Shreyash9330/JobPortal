package com.shreyash.jobportal.entity;

import com.shreyash.jobportal.enums.ApplicationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;



@Entity
public class Application extends BaseEntity{

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private Long jobId;
	    private String userEmail;
	
	    private String resumePath;
	    private String jobTitle;
	    
	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private ApplicationStatus status;
	    
		public String getJobTitle() {
			return jobTitle;
		}
		public void setJobTitle(String jobTitle) {
			this.jobTitle = jobTitle;
		}
		public String getResumePath() {
			return resumePath;
		}
		public void setResumePath(String resumePath) {
			this.resumePath = resumePath;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public Long getJobId() {
			return jobId;
		}
		public void setJobId(Long jobId) {
			this.jobId = jobId;
		}
		public String getUserEmail() {
			return userEmail;
		}
		public void setUserEmail(String userEmail) {
			this.userEmail = userEmail;
		}
		public ApplicationStatus getStatus() {
		    return status;
		}
		public void setStatus(ApplicationStatus status) {
		    this.status = status;
		}
	    
	    
}
