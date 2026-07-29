package com.agrirent.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.agrirent.auth_service.dto.LoginResponse;
import com.agrirent.auth_service.entity.User;
import com.agrirent.auth_service.repository.UserRepository;
import com.agrirent.auth_service.util.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {

        user.setPassword(
                encoder.encode(user.getPassword())
        );

        if(user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        User savedUser = repo.save(user);

        savedUser.setPassword(null);

        return savedUser;
    }

    public LoginResponse login(String email, String password) {

        User user = repo.findByEmail(email);

        if(user != null &&
           encoder.matches(password, user.getPassword())) {

            String token =
                    jwtUtil.generateToken(
                            user.getEmail()
                    );

            return new LoginResponse(
                    user.getId(),
                    token,
                    user.getRole(),
                    user.getName(),
                    user.getEmail()
            );
        }

        return null;
    }

    public User getUserById(Long id) {
        User user = repo.findById(id).orElse(null);
        if (user != null) {
            user.setPassword(null);
        }
        return user;
    }
}