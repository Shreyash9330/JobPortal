package com.shreyash.jobportal.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.shreyash.jobportal.entity.PasswordResetToken;
import com.shreyash.jobportal.entity.User;
import com.shreyash.jobportal.repository.PasswordResetTokenRepository;
import com.shreyash.jobportal.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordResetTokenRepository tokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock EmailService emailService;

    @InjectMocks PasswordResetService service;

    private static final String EMAIL = "a@test.com";

    private PasswordResetToken token(int attempts, LocalDateTime expiresAt) {
        PasswordResetToken t = new PasswordResetToken();
        t.setEmail(EMAIL);
        t.setOtpHash("hash");
        t.setAttempts(attempts);
        t.setCreatedAt(LocalDateTime.now().minusMinutes(1));
        t.setExpiresAt(expiresAt);
        return t;
    }

    @Test
    void requestOtp_unknownEmail_sendsNothing() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        service.requestOtp(EMAIL);

        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendOtp(any(), any());
    }

    @Test
    void requestOtp_knownEmail_savesHashedOtpAndSendsMail() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(new User()));
        when(tokenRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hash");

        service.requestOtp(EMAIL);

        verify(tokenRepository).save(any(PasswordResetToken.class));
        verify(emailService).sendOtp(eq(EMAIL), matches("\\d{6}"));
    }

    @Test
    void resetPassword_wrongOtp_incrementsAttempts() {
        PasswordResetToken t = token(0, LocalDateTime.now().plusMinutes(5));
        when(tokenRepository.findByEmail(EMAIL)).thenReturn(Optional.of(t));
        when(passwordEncoder.matches("111111", "hash")).thenReturn(false);

        boolean ok = service.resetPassword(EMAIL, "111111", "NewPass@123");

        assertFalse(ok);
        assertEquals(1, t.getAttempts());
    }

    @Test
    void resetPassword_correctOtp_updatesPasswordAndDeletesToken() {
        PasswordResetToken t = token(0, LocalDateTime.now().plusMinutes(5));
        User user = new User();
        when(tokenRepository.findByEmail(EMAIL)).thenReturn(Optional.of(t));
        when(passwordEncoder.matches("123456", "hash")).thenReturn(true);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewPass@123")).thenReturn("newhash");

        boolean ok = service.resetPassword(EMAIL, "123456", "NewPass@123");

        assertTrue(ok);
        assertEquals("newhash", user.getPassword());
        verify(tokenRepository).delete(t);
    }

    @Test
    void resetPassword_expiredToken_failsAndDeletesToken() {
        PasswordResetToken t = token(0, LocalDateTime.now().minusMinutes(1));
        when(tokenRepository.findByEmail(EMAIL)).thenReturn(Optional.of(t));

        boolean ok = service.resetPassword(EMAIL, "123456", "NewPass@123");

        assertFalse(ok);
        verify(tokenRepository).delete(t);
    }
}