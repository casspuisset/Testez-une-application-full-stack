package com.openclassrooms.starterjwt.security.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

public class UserDetilsServiceImplTest {

    @Test
    void loadUserByUsername_ShouldReturnUserDetailsImplIfUserIsFound_AndNotFoundIfUserIsNotFound() {
        UserRepository userRepository = mock(UserRepository.class);
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setFirstName("Test");
        user.setLastName("TEST");
        user.setPassword("token");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        UserDetailsServiceImpl service = new UserDetailsServiceImpl(userRepository);
        UserDetails userDetails = service.loadUserByUsername("test@test.com");

        assertEquals("test@test.com", userDetails.getUsername());
        assertEquals("Test", ((UserDetailsImpl) userDetails).getFirstName());
        assertEquals("TEST", ((UserDetailsImpl) userDetails).getLastName());
        assertEquals("token", userDetails.getPassword());

        // case not found
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());

        UserDetailsServiceImpl notFoundService = new UserDetailsServiceImpl(userRepository);

        assertThrows(UsernameNotFoundException.class, () -> {
            notFoundService.loadUserByUsername("test@test.com");
        });

    }
}
