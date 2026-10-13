package com.shreyash.jobportal.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Uploaded resume (PDF) stored in the database so it survives restarts on
 * hosts with an ephemeral disk (for example Render's free tier).
 */
@Getter
@Setter
@Entity
@Table(name = "resume_file")
public class ResumeFile {

    @Id
    @Column(length = 64)
    private String id;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] data;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
