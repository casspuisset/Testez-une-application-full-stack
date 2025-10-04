package com.openclassrooms.starterjwt.security.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;

import org.junit.jupiter.api.Test;

public class UserDetailsImplTest {

    @Test
    void builderAndGetters() {
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("user")
                .firstName("Test")
                .lastName("TEST")
                .admin(true)
                .password("token")
                .build();

        assertEquals(1L, user.getId());
        assertEquals("user", user.getUsername());
        assertEquals("Test", user.getFirstName());
        assertEquals("TEST", user.getLastName());
        assertTrue(user.getAdmin());
        assertEquals("token", user.getPassword());
    }

    @Test
    void authoritiesIsEmpty() {
        UserDetailsImpl user = UserDetailsImpl.builder().build();
        assertEquals(new HashSet<>(), user.getAuthorities());
    }

    @Test
    void accountStatusMethods() {
        UserDetailsImpl user = UserDetailsImpl.builder().build();
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
    }

    @Test
    void equalsAndHashCode() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl userEqual = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl userInequal = UserDetailsImpl.builder().id(2L).build();

        assertEquals(user, userEqual);
        assertNotEquals(user, userInequal);
        assertNotEquals(user, null);
        assertNotEquals(user, new Object());
    }

    @Test
    void toString_ShouldContainBuilderFields() {
        UserDetailsImpl.UserDetailsImplBuilder builder = UserDetailsImpl.builder()
                .id(1L)
                .username("user")
                .firstName("Test")
                .lastName("TEST")
                .admin(true)
                .password("token");

        String builderString = builder.toString();

        assertTrue(builderString.contains("id=1"));
        assertTrue(builderString.contains("username=user"));
        assertTrue(builderString.contains("firstName=Test"));
        assertTrue(builderString.contains("lastName=TEST"));
        assertTrue(builderString.contains("admin=true"));
        assertTrue(builderString.contains("password=token"));
    }
}
