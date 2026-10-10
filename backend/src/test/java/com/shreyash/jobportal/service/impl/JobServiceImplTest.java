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

import com.shreyash.jobportal.entity.Job;
import com.shreyash.jobportal.enums.JobStatus;
import com.shreyash.jobportal.enums.JobType;
import com.shreyash.jobportal.exception.ResourceNotFoundException;
import com.shreyash.jobportal.repository.JobRepository;

@ExtendWith(MockitoExtension.class)
class JobServiceImplTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobServiceImpl jobService;

    private Job job(String title, String location, JobType type) {
        Job job = new Job();
        job.setTitle(title);
        job.setLocation(location);
        job.setJobType(type);
        return job;
    }

    @Test
    void addJob_setsStatusActive() {
        when(jobRepository.save(any(Job.class))).thenAnswer(inv -> inv.getArgument(0));

        Job saved = jobService.addJob(new Job());

        assertEquals(JobStatus.ACTIVE, saved.getStatus());
    }

    @Test
    void getJobById_notFound_throws() {
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobService.getJobById(99L));
    }

    @Test
    void updateJob_updatesFieldsAndKeepsJobTypeWhenNull() {
        Job existing = job("Old", "Pune", JobType.FULL_TIME);
        Job incoming = job("New", "Mumbai", null);
        incoming.setSkills("Java, Spring");
        incoming.setExperience("2");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(jobRepository.save(any(Job.class))).thenAnswer(inv -> inv.getArgument(0));

        Job updated = jobService.updateJob(1L, incoming);

        assertEquals("New", updated.getTitle());
        assertEquals("Mumbai", updated.getLocation());
        assertEquals("Java, Spring", updated.getSkills());
        assertEquals("2", updated.getExperience());
        assertEquals(JobType.FULL_TIME, updated.getJobType());
    }

    @Test
    void updateJob_notFound_throws() {
        when(jobRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> jobService.updateJob(404L, new Job()));
    }

    @Test
    void filterJobs_byTitle_isCaseInsensitiveContains() {
        when(jobRepository.findAll()).thenReturn(List.of(
                job("Java Developer", "Pune", JobType.FULL_TIME),
                job("Senior JAVA Engineer", "Mumbai", JobType.FULL_TIME),
                job("Web Developer", "Pune", JobType.FULL_TIME)));

        List<Job> result = jobService.filterJobs("java", null, null, null);

        assertEquals(2, result.size());
    }

    @Test
    void filterJobs_byLocation_ignoresCase() {
        when(jobRepository.findAll()).thenReturn(List.of(
                job("A", "Pune", JobType.FULL_TIME),
                job("B", "Mumbai", JobType.FULL_TIME)));

        List<Job> result = jobService.filterJobs(null, "pune", null, null);

        assertEquals(1, result.size());
        assertEquals("A", result.get(0).getTitle());
    }

    @Test
    void filterJobs_byJobTypeLabel_matchesEnum() {
        when(jobRepository.findAll()).thenReturn(List.of(
                job("A", "Pune", JobType.FULL_TIME),
                job("B", "Pune", JobType.INTERNSHIP)));

        List<Job> result = jobService.filterJobs(null, null, "Full Time", null);

        assertEquals(1, result.size());
        assertEquals(JobType.FULL_TIME, result.get(0).getJobType());
    }

    @Test
    void filterJobs_invalidJobType_throwsIllegalArgument() {
        when(jobRepository.findAll()).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class,
                () -> jobService.filterJobs(null, null, "Work From Home", null));
    }

    @Test
    void filterJobs_blankFilters_returnsEverything() {
        when(jobRepository.findAll()).thenReturn(List.of(
                job("A", "Pune", JobType.FULL_TIME),
                job("B", "Mumbai", JobType.REMOTE)));

        assertEquals(2, jobService.filterJobs("", " ", "", ""). size());
    }
}