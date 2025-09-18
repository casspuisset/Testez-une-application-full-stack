package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtResponseTest {

    @Test
    void testConstructorAndGetters() {
        JwtResponse response = new JwtResponse(
                "jwt-token",
                1L,
                "test@test.com",
                "test",
                "Test",
                true);

        assertEquals("jwt-token", response.getToken());
        assertEquals("Bearer", response.getType());
        assertEquals(1L, response.getId());
        assertEquals("test@test.com", response.getUsername());
        assertEquals("test", response.getFirstName());
        assertEquals("Test", response.getLastName());
        assertTrue(response.getAdmin());
    }

    @Test
    void testSetters() {
        JwtResponse response = new JwtResponse(
                "token", 1L, "user", "first", "last", false);

        response.setToken("newToken");
        response.setType("customType");
        response.setId(2L);
        response.setUsername("newUser");
        response.setFirstName("firstname");
        response.setLastName("lastname");
        response.setAdmin(true);

        assertEquals("newToken", response.getToken());
        assertEquals("customType", response.getType());
        assertEquals(2L, response.getId());
        assertEquals("newUser", response.getUsername());
        assertEquals("firstname", response.getFirstName());
        assertEquals("lastname", response.getLastName());
        assertTrue(response.getAdmin());
    }

    @Test
    void testTypeDefaultValue() {
        JwtResponse response = new JwtResponse(
                "token", 1L, "test", "test", "Test", false);
        assertEquals("Bearer", response.getType());
    }
}