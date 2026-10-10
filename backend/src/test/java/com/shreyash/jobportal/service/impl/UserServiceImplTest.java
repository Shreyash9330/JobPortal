package com.shreyash.jobportal.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.shreyash.jobportal.entity.User;
import com.shreyash.jobportal.enums.Role;
import com.shreyash.jobportal.exception.DuplicateResourceException;
import com.shreyash.jobportal.exception.InvalidCredentialsException;
import com.shreyash.jobportal.repository.UserRepository;
import com.shreyash.jobportal.security.JwtUtil;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User newUser(String email, String password) {
        User user = new User();
        user.setName("Test");
        user.setEmail(email);
        user.setPassword(password);
        return user;
    }

    @Test
    void saveUser_encodesPasswordAndDefaultsRoleToJobSeeker() {
        User user = newUser("a@b.com", "plain");
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("plain")).thenReturn("HASH");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.saveUser(user);

        assertEquals("HASH", saved.getPassword());
        assertEquals(Role.JOBSEEKER, saved.getRole());
    }

    @Test
    void saveUser_keepsRoleWhenProvided() {
        User user = newUser("e@b.com", "plain");
        user.setRole(Role.EMPLOYER);
        when(userRepository.findByEmail("e@b.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("plain")).thenReturn("HASH");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        assertEquals(Role.EMPLOYER, userService.saveUser(user).getRole());
    }

    @Test
    void saveUser_duplicateEmail_throwsAndDoesNotSave() {
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(new User()));

        assertThrows(DuplicateResourceException.class,
                () -> userService.saveUser(newUser("a@b.com", "plain")));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_validCredentials_returnsToken() {
        User stored = newUser("a@b.com", "HASH");
        stored.setRole(Role.EMPLOYER);
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(stored));
        when(passwordEncoder.matches("plain", "HASH")).thenReturn(true);
        when(jwtUtil.generateToken("a@b.com", Role.EMPLOYER)).thenReturn("token123");

        assertEquals("token123", userService.login("a@b.com", "plain"));
    }

    @Test
    void login_wrongPassword_throwsInvalidCredentials() {
        User stored = newUser("a@b.com", "HASH");
        stored.setRole(Role.JOBSEEKER);
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(stored));
        when(passwordEncoder.matches("wrong", "HASH")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class,
                () -> userService.login("a@b.com", "wrong"));

        verifyNoInteractions(jwtUtil);
    }

    @Test
    void login_unknownEmail_throwsInvalidCredentials() {
        when(userRepository.findByEmail("none@b.com")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class,
                () -> userService.login("none@b.com", "plain"));
    }
}