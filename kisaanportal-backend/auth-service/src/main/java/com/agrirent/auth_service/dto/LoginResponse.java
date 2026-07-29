package com.agrirent.auth_service.dto;

public class LoginResponse {

    private Long id;
    private String token;
    private String role;
    private String name;
    private String email;

    public LoginResponse() {
    }

    public LoginResponse(Long id, String token, String role, String name, String email) {
        this.id = id;
        this.token = token;
        this.role = role;
        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}