package com.shreyash.jobportal.service;

import java.util.List;

import com.shreyash.jobportal.entity.User;

public interface UserService {
    User saveUser(User user);
    List<User> getAllUsers();
    void deleteUser(Long id);
    
    String login(String email, String password);
}