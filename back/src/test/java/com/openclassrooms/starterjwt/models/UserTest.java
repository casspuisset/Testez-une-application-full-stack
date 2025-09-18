package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class UserTest {

    @Test
    void testUserEntity() {
        User user = new User();
        user.equals(new User());
        user.hashCode();
        user.toString();
        assertNotNull(user.toString());
    }

    // @Test
    // void testUserEntityBuilder() {
    // User user = new User();
    // user.equals(User.builder()
    // .email("test@test.com")
    // .id(2L)
    // .admin(false)
    // .lastName("Test")
    // .firstName("test")
    // .password("password")
    // .createdAt(LocalDateTime.parse("2025-09-02 17:33:14"))
    // .updatedAt(LocalDateTime.parse("2025-09-02 17:33:14"))
    // .build());
    // assertNotNull(user.toString());
    // }
}