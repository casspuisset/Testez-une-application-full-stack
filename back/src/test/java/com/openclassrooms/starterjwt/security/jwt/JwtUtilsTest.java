package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;

import java.lang.reflect.Field;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() throws Exception {
        jwtUtils = new JwtUtils();

        Field jwtSecret = JwtUtils.class.getDeclaredField("jwtSecret");
        Field jwtExpirationMs = JwtUtils.class.getDeclaredField("jwtExpirationMs");

        jwtSecret.setAccessible(true);
        jwtSecret.set(jwtUtils, "test");
        jwtExpirationMs.setAccessible(true);
        jwtExpirationMs.set(jwtUtils, 1000 * 60);
    }

    @Test
    void generateJwtToken() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("user")
                .firstName("test")
                .lastName("TEST")
                .admin(false)
                .password("password")
                .build();

        Authentication authentication = Mockito.mock(Authentication.class);
        Mockito.when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    void getUserNameFromJwtToken_ShouldExtractUsernameFromTheToken() {
        String username = "user";
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(SignatureAlgorithm.HS512, "test")
                .compact();

        String extracted = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals(username, extracted);
    }

    @Test
    void validateJwtToken_ShouldReturnFalseWhenTokenIsExpired() {
        String token = Jwts.builder()
                .setSubject("user")
                .setIssuedAt(new Date(System.currentTimeMillis() - 120000))
                .setExpiration(new Date(System.currentTimeMillis() - 60000))
                .signWith(SignatureAlgorithm.HS512, "test")
                .compact();

        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    void validateJwtToken_shouldReturnFalseWhenTokenIsInvalid() {
        assertFalse(jwtUtils.validateJwtToken("invalid test"));
    }

    @Test
    void validateJwtToken_shouldReturnFalseWhenTokenIsNull() {
        assertFalse(jwtUtils.validateJwtToken(null));
    }

    @Test
    void validateJwtToken_shouldReturnFalseWhenTokenIsEmpty() {
        assertFalse(jwtUtils.validateJwtToken(""));
    }
}