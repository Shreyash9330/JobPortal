package com.shreyash.jobportal.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends the password-reset OTP.
 *
 * Order of preference:
 * 1. Brevo HTTP API when BREVO_API_KEY is set (works on hosts that block SMTP,
 *    such as Render's free tier).
 * 2. SMTP via JavaMailSender when spring.mail.* is configured.
 * 3. Dev fallback: the OTP is written to the server log.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";
    private static final String SUBJECT = "JobPortal password reset OTP";

    private final ObjectProvider<JavaMailSender> mailSender;
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    @Value("${app.mail.from:no-reply@jobportal.local}")
    private String from;

    @Value("${app.mail.brevo-api-key:}")
    private String brevoApiKey;

    public EmailService(ObjectProvider<JavaMailSender> mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String otp) {
        String body = "Your OTP is " + otp + ". It is valid for 10 minutes.\n"
                + "If you did not request this, ignore this email.";

        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            sendViaBrevo(to, body);
            return;
        }

        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null) {
            // Dev only: no mail provider configured, so print the OTP in the server log
            log.warn("Mail not configured. DEV OTP for {} is {}", to, otp);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject(SUBJECT);
            msg.setText(body);
            sender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", to, e);
        }
    }

    private void sendViaBrevo(String to, String text) {
        String json = "{\"sender\":{\"name\":\"JobPortal\",\"email\":\"" + escape(from) + "\"},"
                + "\"to\":[{\"email\":\"" + escape(to) + "\"}],"
                + "\"subject\":\"" + escape(SUBJECT) + "\","
                + "\"textContent\":\"" + escape(text) + "\"}";
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(BREVO_URL))
                    .timeout(Duration.ofSeconds(10))
                    .header("api-key", brevoApiKey)
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() / 100 != 2) {
                log.error("Brevo rejected OTP email to {}: HTTP {} {}", to,
                        response.statusCode(), response.body());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Interrupted while sending OTP email to {}", to, e);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {} via Brevo", to, e);
        }
    }

    static String escape(String value) {
        StringBuilder sb = new StringBuilder();
        for (char c : value.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.toString();
    }
}
