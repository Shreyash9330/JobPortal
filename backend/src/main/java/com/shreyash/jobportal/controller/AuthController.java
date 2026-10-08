package com.shreyash.jobportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shreyash.jobportal.dto.EmployerRegisterDTO;
import com.shreyash.jobportal.dto.UserDTO;
import com.shreyash.jobportal.entity.EmployerProfile;
import com.shreyash.jobportal.entity.User;
import com.shreyash.jobportal.repository.UserRepository;
import com.shreyash.jobportal.security.JwtUtil;
import com.shreyash.jobportal.service.EmployerRegistrationService;
import com.shreyash.jobportal.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EmployerRegistrationService employerRegistrationService;
    
    @PostMapping("/users")
    public User saveUser(@Valid @RequestBody UserDTO userDTO) {

        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        // ✅ ADD THIS LINE
        user.setRole(userDTO.getRole());

        return userService.saveUser(user);
    }
     
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.login(
        		user.getEmail(), 
        		user.getPassword()
        	);
    }
    
    @GetMapping("/users/count")
    public long getUserCount() {
        return userRepository.count();
    }
       
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }
    
   
    
    @PostMapping("/auth/register/employer")
    public EmployerProfile registerEmployer(
            @Valid @RequestBody EmployerRegisterDTO employerDTO) {

        return employerRegistrationService.registerEmployer(employerDTO);
    }
 }
   
