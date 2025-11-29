package com.example.hotelbooking.util;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String testSecret = "cGxlYXNlQ2hhbmdlVGhpc1N0cm9uZ1NlY3JldEtleUZvclByb2R1Y3Rpb25Vc2VXaXRoTWluaW11bTI1NkJpdHNMZW5ndGg=";
    private final long testExpiration = 18000000; // 5 hours

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", testSecret);
        ReflectionTestUtils.setField(jwtUtil, "expiration", testExpiration);
    }

    @Test
    void testGenerateToken() {
        String token = jwtUtil.generateToken("testuser", "CUSTOMER");

        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void testExtractUsername() {
        String token = jwtUtil.generateToken("testuser", "CUSTOMER");
        String username = jwtUtil.getUsernameFromToken(token);

        assertEquals("testuser", username);
    }

    @Test
    void testExtractRole() {
        String token = jwtUtil.generateToken("testuser", "ADMIN");
        String role = jwtUtil.getRoleFromToken(token);

        assertEquals("ADMIN", role);
    }

    @Test
    void testValidateTokenSuccess() {
        String token = jwtUtil.generateToken("testuser", "CUSTOMER");
        boolean isValid = jwtUtil.validateToken(token, "testuser");

        assertTrue(isValid);
    }

    @Test
    void testValidateTokenWrongUsername() {
        String token = jwtUtil.generateToken("testuser", "CUSTOMER");
        boolean isValid = jwtUtil.validateToken(token, "wronguser");

        assertFalse(isValid);
    }

    @Test
    void testValidateTokenInvalidFormat() {
        assertThrows(Exception.class, () -> {
            jwtUtil.validateToken("invalid.token.format", "testuser");
        });
    }

    @Test
    void testTokenExpiration() {
        String token = jwtUtil.generateToken("testuser", "CUSTOMER");
        Claims claims = jwtUtil.extractAllClaims(token);

        assertNotNull(claims.getExpiration());
        assertTrue(claims.getExpiration().getTime() > System.currentTimeMillis());
    }

    @Test
    void testExtractAllClaims() {
        String token = jwtUtil.generateToken("testuser", "ADMIN");
        Claims claims = jwtUtil.extractAllClaims(token);

        assertEquals("testuser", claims.getSubject());
        assertEquals("ADMIN", claims.get("role"));
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
    }
}
