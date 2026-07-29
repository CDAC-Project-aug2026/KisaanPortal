package com.agrirent.auth_service.controller;

import com.agrirent.auth_service.entity.User;
import com.agrirent.auth_service.service.AuthService;
import com.agrirent.auth_service.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private AuthService service;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("john.doe@example.com");
        sampleUser.setPassword("securePassword123");
    }

    @Nested
    @DisplayName("GET /auth/validate")
    class ValidateTokenTests {

        @Test
        @DisplayName("Should return 'Token is valid' when token is valid")
        void validateToken_ValidToken_ReturnsSuccess() throws Exception {
            String token = "valid.jwt.token";
            when(jwtUtil.validateToken(token)).thenReturn(true);

            mockMvc.perform(get("/auth/validate")
                            .param("token", token))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Token is valid"));

            verify(jwtUtil).validateToken(token);
        }

        @Test
        @DisplayName("Should return 'Invalid token' when token is invalid")
        void validateToken_InvalidToken_ReturnsFailure() throws Exception {
            String token = "invalid.jwt.token";
            when(jwtUtil.validateToken(token)).thenReturn(false);

            mockMvc.perform(get("/auth/validate")
                            .param("token", token))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Invalid token"));

            verify(jwtUtil).validateToken(token);
        }

        @Test
        @DisplayName("Should return 400 Bad Request when token param is missing")
        void validateToken_MissingParam_ReturnsBadRequest() throws Exception {
            mockMvc.perform(get("/auth/validate"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("POST /auth/register")
    class RegisterTests {

        @Test
        @DisplayName("Should register user and return 200 OK with registered user payload")
        void register_Success() throws Exception {
            when(service.register(any(User.class))).thenReturn(sampleUser);

            mockMvc.perform(post("/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(sampleUser)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(sampleUser.getId()))
                    .andExpect(jsonPath("$.email").value(sampleUser.getEmail()));

            verify(service).register(any(User.class));
        }
    }

    @Nested
    @DisplayName("POST /auth/login")
    class LoginTests {

        @Test
        @DisplayName("Should return 200 OK with auth response on successful login")
        void login_Success() throws Exception {
            Map<String, String> mockAuthResponse = Map.of("token", "dummy-jwt-token");

            // Avoids type mismatch / inference issues with Object return type
            doReturn(mockAuthResponse)
                    .when(service)
                    .login(sampleUser.getEmail(), sampleUser.getPassword());

            mockMvc.perform(post("/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(sampleUser)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value("dummy-jwt-token"));

            verify(service).login(sampleUser.getEmail(), sampleUser.getPassword());
        }
    }

    @Nested
    @DisplayName("GET /auth/users/{id}")
    class GetUserByIdTests {

        @Test
        @DisplayName("Should return 200 OK with User payload when user exists")
        void getUserById_UserFound_ReturnsOk() throws Exception {
            Long userId = 1L;
            when(service.getUserById(userId)).thenReturn(sampleUser);

            mockMvc.perform(get("/auth/users/{id}", userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(userId))
                    .andExpect(jsonPath("$.email").value(sampleUser.getEmail()));

            verify(service).getUserById(userId);
        }

        @Test
        @DisplayName("Should return 404 Not Found when user does not exist")
        void getUserById_UserNotFound_Returns404() throws Exception {
            Long userId = 99L;
            when(service.getUserById(userId)).thenReturn(null);

            mockMvc.perform(get("/auth/users/{id}", userId))
                    .andExpect(status().isNotFound());

            verify(service).getUserById(userId);
        }
    }
}