package com.shreyash.jobportal.service.impl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.shreyash.jobportal.entity.User;
import com.shreyash.jobportal.enums.Role;
import com.shreyash.jobportal.repository.UserRepository;
import com.shreyash.jobportal.security.JwtUtil;
import com.shreyash.jobportal.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

   

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    public String login(String email, String password) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            boolean match = passwordEncoder.matches(
                    password,
                    user.getPassword()
            );

            if (match) {
                return jwtUtil.generateToken(
                        user.getEmail(),
                        user.getRole()
                );
            }
        }

        return "Invalid credentials";
    }
    
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    @Override
    public User saveUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null) {
            user.setRole(Role.JOBSEEKER);
        }

        return userRepository.save(user);
    }
}