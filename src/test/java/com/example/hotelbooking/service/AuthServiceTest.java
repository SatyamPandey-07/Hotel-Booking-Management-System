package com.example.hotelbooking.service;

import com.example.hotelbooking.dao.UserDAO;
import com.example.hotelbooking.dto.LoginRequest;
import com.example.hotelbooking.dto.LoginResponse;
import com.example.hotelbooking.dto.RegisterRequest;
import com.example.hotelbooking.dto.RegisterResponse;
import com.example.hotelbooking.exception.DuplicateUserException;
import com.example.hotelbooking.exception.InactiveAccountException;
import com.example.hotelbooking.exception.InvalidCredentialsException;
import com.example.hotelbooking.model.User;
import com.example.hotelbooking.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserDAO userDAO;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private LoginRequest loginRequest;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setUsername("testuser");
        testUser.setPassword("$2a$10$hashedpassword");
        testUser.setEmail("test@example.com");
        testUser.setRole("CUSTOMER");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setActive(true);

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setEmail("new@example.com");
        registerRequest.setPassword("Password123");
        registerRequest.setFirstName("New");
        registerRequest.setLastName("User");
    }

    @Test
    void testLoginSuccess() {
        when(userDAO.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken("testuser", "CUSTOMER")).thenReturn("mock-jwt-token");

        LoginResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("testuser", response.getUsername());
        assertEquals("CUSTOMER", response.getRole());
        verify(userDAO, times(1)).updateLastLogin(1);
    }

    @Test
    void testLoginUserNotFound() {
        when(userDAO.findByUsername("testuser")).thenReturn(null);

        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginRequest);
        });
    }

    @Test
    void testLoginInvalidPassword() {
        when(userDAO.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginRequest);
        });
    }

    @Test
    void testLoginInactiveAccount() {
        testUser.setActive(false);
        when(userDAO.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);

        assertThrows(InactiveAccountException.class, () -> {
            authService.login(loginRequest);
        });
    }

    @Test
    void testRegisterSuccess() {
        when(userDAO.findByUsername("newuser")).thenReturn(null);
        when(userDAO.findByEmail("new@example.com")).thenReturn(null);
        when(passwordEncoder.encode("Password123")).thenReturn("$2a$10$hashedpassword");
        
        User createdUser = new User();
        createdUser.setId(2);
        createdUser.setUsername("newuser");
        createdUser.setRole("CUSTOMER");
        when(userDAO.findByUsername("newuser")).thenReturn(null, createdUser);

        RegisterResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("newuser", response.getUsername());
        assertEquals("CUSTOMER", response.getRole());
        verify(userDAO, times(1)).addUser(any(User.class));
    }

    @Test
    void testRegisterDuplicateUsername() {
        when(userDAO.findByUsername("newuser")).thenReturn(testUser);

        assertThrows(DuplicateUserException.class, () -> {
            authService.register(registerRequest);
        });
    }

    @Test
    void testRegisterDuplicateEmail() {
        when(userDAO.findByUsername("newuser")).thenReturn(null);
        when(userDAO.findByEmail("new@example.com")).thenReturn(testUser);

        assertThrows(DuplicateUserException.class, () -> {
            authService.register(registerRequest);
        });
    }

    @Test
    void testValidateTokenSuccess() {
        when(jwtUtil.validateToken("valid-token", "testuser")).thenReturn(true);

        boolean result = authService.validateToken("valid-token", "testuser");

        assertTrue(result);
    }

    @Test
    void testValidateTokenFailure() {
        when(jwtUtil.validateToken("invalid-token", "testuser")).thenThrow(new RuntimeException("Invalid token"));

        boolean result = authService.validateToken("invalid-token", "testuser");

        assertFalse(result);
    }
}
