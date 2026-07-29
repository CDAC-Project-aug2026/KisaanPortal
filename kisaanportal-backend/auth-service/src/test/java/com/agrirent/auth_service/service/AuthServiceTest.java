package com.agrirent.auth_service.service;

import com.agrirent.auth_service.dto.LoginResponse;
import com.agrirent.auth_service.entity.User;
import com.agrirent.auth_service.repository.UserRepository;
import com.agrirent.auth_service.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("John Doe");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPassword("plainPassword123");
    }


    @Nested
    @DisplayName("register Tests")
    class RegisterTests {

        @Test
        @DisplayName("Should assign default role 'USER', encode password, and set password to null in response")
        void register_DefaultRoleAndSanitizesPassword() {
            // Given
            sampleUser.setRole(null); // No role assigned initially

            when(repo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            User result = authService.register(sampleUser);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getRole()).isEqualTo("USER");
            assertThat(result.getPassword()).isNull(); // Password must be sanitized before returning

            verify(repo, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should preserve existing role if role is already provided")
        void register_PreservesExistingRole() {
            // Given
            sampleUser.setRole("ADMIN");

            when(repo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            User result = authService.register(sampleUser);

            // Then
            assertThat(result.getRole()).isEqualTo("ADMIN");
            assertThat(result.getPassword()).isNull();

            verify(repo, times(1)).save(any(User.class));
        }
    }


    @Nested
    @DisplayName("login Tests")
    class LoginTests {

        @Test
        @DisplayName("Should return LoginResponse with JWT token on valid credentials")
        void login_ValidCredentials_ReturnsLoginResponse() {
            // Given
            String rawPassword = "plainPassword123";
            String encodedPassword = encoder.encode(rawPassword);
            sampleUser.setPassword(encodedPassword);
            sampleUser.setRole("FARMER");

            String expectedToken = "mocked-jwt-token";

            when(repo.findByEmail(sampleUser.getEmail())).thenReturn(sampleUser);
            when(jwtUtil.generateToken(sampleUser.getEmail())).thenReturn(expectedToken);

            // When
            LoginResponse response = authService.login(sampleUser.getEmail(), rawPassword);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(sampleUser.getId());
            assertThat(response.getToken()).isEqualTo(expectedToken);
            assertThat(response.getRole()).isEqualTo("FARMER");
            assertThat(response.getName()).isEqualTo(sampleUser.getName());
            assertThat(response.getEmail()).isEqualTo(sampleUser.getEmail());

            verify(jwtUtil, times(1)).generateToken(sampleUser.getEmail());
        }

        @Test
        @DisplayName("Should return null when user is not found")
        void login_UserNotFound_ReturnsNull() {
            // Given
            when(repo.findByEmail("nonexistent@example.com")).thenReturn(null);

            // When
            LoginResponse response = authService.login("nonexistent@example.com", "anyPassword");

            // Then
            assertThat(response).isNull();
            verify(jwtUtil, never()).generateToken(any());
        }

        @Test
        @DisplayName("Should return null when password does not match")
        void login_WrongPassword_ReturnsNull() {
            // Given
            sampleUser.setPassword(encoder.encode("correctPassword"));
            when(repo.findByEmail(sampleUser.getEmail())).thenReturn(sampleUser);

            // When
            LoginResponse response = authService.login(sampleUser.getEmail(), "wrongPassword");

            // Then
            assertThat(response).isNull();
            verify(jwtUtil, never()).generateToken(any());
        }
    }

  
    @Nested
    @DisplayName("getUserById Tests")
    class GetUserByIdTests {

        @Test
        @DisplayName("Should return user with password set to null when user exists")
        void getUserById_UserFound_ReturnsSanitizedUser() {
            // Given
            Long userId = 1L;
            sampleUser.setPassword("hashedSecretKey");

            when(repo.findById(userId)).thenReturn(Optional.of(sampleUser));

            // When
            User result = authService.getUserById(userId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(userId);
            assertThat(result.getPassword()).isNull(); // Password should be set to null for safety
        }

        @Test
        @DisplayName("Should return null when user is not found")
        void getUserById_UserNotFound_ReturnsNull() {
            // Given
            Long userId = 99L;
            when(repo.findById(userId)).thenReturn(Optional.empty());

            // When
            User result = authService.getUserById(userId);

            // Then
            assertThat(result).isNull();
        }
    }
}