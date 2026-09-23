package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class Application {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private Long jobId;
	    private String userEmail;
	    private String status;
	    private String resumePath;
	    private String jobTitle;
	    
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
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
	    
	    
}
