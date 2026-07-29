package com.agrirent.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.agrirent.auth_service.entity.User;
import com.agrirent.auth_service.service.AuthService;
import com.agrirent.auth_service.util.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService service;

    @GetMapping("/validate")
    public String validateToken(@RequestParam String token) {
        boolean isValid = jwtUtil.validateToken(token);
        if (isValid) {
            return "Token is valid";
        }
        return "Invalid token";
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User registeredUser = service.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User user) {
        Object authResponse = service.login(user.getEmail(), user.getPassword());
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = service.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}