package com.shreyash.jobportal.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.shreyash.jobportal.entity.Application;
import com.shreyash.jobportal.entity.Job;
import com.shreyash.jobportal.enums.Role;
import com.shreyash.jobportal.exception.DuplicateResourceException;
import com.shreyash.jobportal.exception.GlobalExceptionHandler;
import com.shreyash.jobportal.repository.UserRepository;
import com.shreyash.jobportal.security.JwtFilter;
import com.shreyash.jobportal.security.JwtUtil;
import com.shreyash.jobportal.security.SecurityConfig;
import com.shreyash.jobportal.service.ApplicationService;
import com.shreyash.jobportal.service.EmployerRegistrationService;
import com.shreyash.jobportal.service.JobService;
import com.shreyash.jobportal.service.UserService;

@WebMvcTest(controllers = { AuthController.class, JobController.class, ApplicationController.class })
@ContextConfiguration(classes = {
        AuthController.class, JobController.class, ApplicationController.class,
        GlobalExceptionHandler.class, SecurityConfig.class, JwtUtil.class })
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-test-secret-key-123456",
        "app.jwt.expiration-ms=3600000",
        "app.upload-dir=target/test-uploads"
})
class SecurityRulesTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private EmployerRegistrationService employerRegistrationService;

    @MockitoBean
    private JobService jobService;

    @MockitoBean
    private ApplicationService applicationService;

    private String bearer(String email, Role role) {
        return "Bearer " + jwtUtil.generateToken(email, role);
    }

    @Test
    void jobsList_isPublic() throws Exception {
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk());
    }

    @Test
    void login_isPublic_andReturnsToken() throws Exception {
        when(userService.login("a@b.com", "secret")).thenReturn("token-123");

        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"password\":\"secret\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("token-123"));
    }

    @Test
    void users_withoutToken_returns401Json() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @Test
    void users_withGarbageToken_returns401() throws Exception {
        mockMvc.perform(get("/api/users").header("Authorization", "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void users_asJobSeeker_returns403() throws Exception {
        mockMvc.perform(get("/api/users").header("Authorization", bearer("js@x.com", Role.JOBSEEKER)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void users_asAdmin_returns200() throws Exception {
        mockMvc.perform(get("/api/users").header("Authorization", bearer("admin@x.com", Role.ADMIN)))
                .andExpect(status().isOk());
    }

    @Test
    void postJob_asJobSeeker_returns403() throws Exception {
        mockMvc.perform(post("/api/jobs")
                .header("Authorization", bearer("js@x.com", Role.JOBSEEKER))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Java Developer\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void postJob_asEmployer_setsOwnerFromToken() throws Exception {
        when(jobService.addJob(any(Job.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(post("/api/jobs")
                .header("Authorization", bearer("hr@x.com", Role.EMPLOYER))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Java Developer\",\"employerEmail\":\"someone-else@x.com\"}"))
                .andExpect(status().isOk());

        ArgumentCaptor<Job> captor = ArgumentCaptor.forClass(Job.class);
        verify(jobService).addJob(captor.capture());
        assertEquals("hr@x.com", captor.getValue().getEmployerEmail());
    }

    @Test
    void updateJob_ownedByAnotherEmployer_returns403() throws Exception {
        Job job = new Job();
        job.setId(1L);
        job.setEmployerEmail("owner@x.com");
        when(jobService.getJobById(1L)).thenReturn(job);

        mockMvc.perform(put("/api/jobs/1")
                .header("Authorization", bearer("intruder@x.com", Role.EMPLOYER))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Hacked\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("You can only access your own data"));
    }

    @Test
    void applications_ofAnotherUser_returns403() throws Exception {
        mockMvc.perform(get("/api/applications/user/other@x.com")
                .header("Authorization", bearer("me@x.com", Role.JOBSEEKER)))
                .andExpect(status().isForbidden());
    }

    @Test
    void applications_ofOwnEmail_returns200() throws Exception {
        mockMvc.perform(get("/api/applications/user/me@x.com")
                .header("Authorization", bearer("me@x.com", Role.JOBSEEKER)))
                .andExpect(status().isOk());
    }

    @Test
    void applyJob_duplicate_returns409() throws Exception {
        when(applicationService.applyJob(any(Application.class)))
                .thenThrow(new DuplicateResourceException("You have already applied for this job"));

        mockMvc.perform(post("/api/applications")
                .header("Authorization", bearer("me@x.com", Role.JOBSEEKER))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobId\":1,\"jobTitle\":\"Java Developer\",\"resumePath\":\"a.pdf\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("You have already applied for this job"));
    }
}