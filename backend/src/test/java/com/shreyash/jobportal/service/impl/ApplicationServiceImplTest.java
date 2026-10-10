package com.shreyash.jobportal.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shreyash.jobportal.entity.Application;
import com.shreyash.jobportal.entity.Job;
import com.shreyash.jobportal.enums.ApplicationStatus;
import com.shreyash.jobportal.exception.DuplicateResourceException;
import com.shreyash.jobportal.exception.ResourceNotFoundException;
import com.shreyash.jobportal.repository.ApplicationRepository;
import com.shreyash.jobportal.repository.JobRepository;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceImplTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private Application newApplication(Long jobId, String email) {
        Application application = new Application();
        application.setJobId(jobId);
        application.setUserEmail(email);
        return application;
    }

    @Test
    void applyJob_success_setsStatusApplied() {
        Application application = newApplication(1L, "u@x.com");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(new Job()));
        when(applicationRepository.existsByJobIdAndUserEmail(1L, "u@x.com")).thenReturn(false);
        when(applicationRepository.save(any(Application.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Application saved = applicationService.applyJob(application);

        assertEquals(ApplicationStatus.APPLIED, saved.getStatus());
    }

    @Test
    void applyJob_jobNotFound_throwsAndDoesNotSave() {
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.applyJob(newApplication(99L, "u@x.com")));

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void applyJob_duplicate_throwsAndDoesNotSave() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(new Job()));
        when(applicationRepository.existsByJobIdAndUserEmail(1L, "u@x.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class,
                () -> applicationService.applyJob(newApplication(1L, "u@x.com")));

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void updateStatus_acceptsAnyCaseAndSpaces() {
        Application existing = new Application();
        when(applicationRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(applicationRepository.save(any(Application.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Application updated = applicationService.updateStatus(5L, " approved ");

        assertEquals(ApplicationStatus.APPROVED, updated.getStatus());
    }

    @Test
    void updateStatus_invalidStatus_throwsIllegalArgument() {
        when(applicationRepository.findById(5L)).thenReturn(Optional.of(new Application()));

        assertThrows(IllegalArgumentException.class,
                () -> applicationService.updateStatus(5L, "FOO"));

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void updateStatus_applicationNotFound_throws() {
        when(applicationRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.updateStatus(404L, "APPROVED"));
    }

    @Test
    void getApplicationsByEmployer_collectsApplicationsOfOwnJobs() {
        Job first = new Job();
        first.setId(1L);
        Job second = new Job();
        second.setId(2L);
        when(jobRepository.findByEmployerEmail("e@x.com")).thenReturn(List.of(first, second));
        when(applicationRepository.findByJobIdIn(List.of(1L, 2L)))
                .thenReturn(List.of(newApplication(1L, "u@x.com")));

        List<Application> result = applicationService.getApplicationsByEmployer("e@x.com");

        assertEquals(1, result.size());
    }

    @Test
    void hasApplied_delegatesToRepository() {
        when(applicationRepository.existsByJobIdAndUserEmail(1L, "u@x.com")).thenReturn(true);

        assertTrue(applicationService.hasApplied(1L, "u@x.com"));
    }
}