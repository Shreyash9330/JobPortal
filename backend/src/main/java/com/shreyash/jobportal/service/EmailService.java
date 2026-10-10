package com.shreyash.jobportal.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSender;

    @Value("${app.mail.from:no-reply@jobportal.local}")
    private String from;

    public EmailService(ObjectProvider<JavaMailSender> mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String otp) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null) {
            // Dev only: SMTP not configured, so print the OTP in the server log
            log.warn("Mail not configured. DEV OTP for {} is {}", to, otp);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject("JobPortal password reset OTP");
            msg.setText("Your OTP is " + otp + ". It is valid for 10 minutes.\n"
                    + "If you did not request this, ignore this email.");
            sender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", to, e);
        }
    }
}