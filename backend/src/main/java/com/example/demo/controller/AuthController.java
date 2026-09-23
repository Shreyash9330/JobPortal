package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.EmployerProfile;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserService;
import com.example.demo.dto.EmployerRegisterDTO;
import com.example.demo.service.EmployerRegistrationService;
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
   
