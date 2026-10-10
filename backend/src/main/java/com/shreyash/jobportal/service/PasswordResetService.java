package com.shreyash.jobportal.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shreyash.jobportal.entity.PasswordResetToken;
import com.shreyash.jobportal.entity.User;
import com.shreyash.jobportal.repository.PasswordResetTokenRepository;
import com.shreyash.jobportal.repository.UserRepository;

@Service
public class PasswordResetService {

    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void requestOtp(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return; // same response for unknown emails
        }

        LocalDateTime now = LocalDateTime.now();
        PasswordResetToken token = tokenRepository.findByEmail(email)
                .orElseGet(PasswordResetToken::new);

        if (token.getCreatedAt() != null
                && token.getCreatedAt().isAfter(now.minusSeconds(RESEND_COOLDOWN_SECONDS))) {
            return; // too soon, ignore silently
        }

        String otp = String.format("%06d", random.nextInt(1_000_000));
        token.setEmail(email);
        token.setOtpHash(passwordEncoder.encode(otp));
        token.setCreatedAt(now);
        token.setExpiresAt(now.plusMinutes(OTP_EXPIRY_MINUTES));
        token.setAttempts(0);
        tokenRepository.save(token);

        emailService.sendOtp(email, otp);
    }

    @Transactional
    public boolean resetPassword(String email, String otp, String newPassword) {
        Optional<PasswordResetToken> opt = tokenRepository.findByEmail(email);
        if (opt.isEmpty()) {
            return false;
        }
        PasswordResetToken token = opt.get();

        if (token.getExpiresAt().isBefore(LocalDateTime.now())
                || token.getAttempts() >= MAX_ATTEMPTS) {
            tokenRepository.delete(token);
            return false;
        }

        if (!passwordEncoder.matches(otp, token.getOtpHash())) {
            token.setAttempts(token.getAttempts() + 1);
            tokenRepository.save(token);
            return false;
        }

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            tokenRepository.delete(token);
            return false;
        }

        User u = user.get();
        u.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(u);
        tokenRepository.delete(token);
        return true;
    }
}