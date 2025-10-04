package com.openclassrooms.starterjwt.IT;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class UserControllerIT {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private UserRepository userRepository;

        @BeforeEach
        void setUp() {
                userRepository.deleteAll();
                SecurityContextHolder.clearContext();
        }

        @Test
        void findById_ShouldReturnUserWithCorrectId() throws Exception {
                User user = new User();
                user.setEmail("test@test.com");
                user.setAdmin(true);
                user.setFirstName("Test");
                user.setLastName("TEST");
                user.setPassword("password");
                user = userRepository.save(user);

                mockMvc.perform(get("/api/user/" + user.getId()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.email").value("test@test.com"));
        }

        @Test
        void findById_ShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
                mockMvc.perform(get("/api/user/42"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void findById_ShouldReturnBadRequestWhenIdIsNotCorrect() throws Exception {
                mockMvc.perform(get("/api/user/wrong"))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void save_ShouldDeleteUserWhisCorrectIdIfAuthorized() throws Exception {
                User user = new User();
                user.setEmail("test@test.com");
                user.setAdmin(false);
                user.setFirstName("Test");
                user.setLastName("TEST");
                user.setPassword("password");
                user = userRepository.save(user);

                UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername("test@test.com")
                                .password("password")
                                .authorities(Collections.emptyList())
                                .build();
                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(userDetails, null,
                                                userDetails.getAuthorities()));

                mockMvc.perform(delete("/api/user/" + user.getId()))
                                .andExpect(status().isOk());

                mockMvc.perform(get("/api/user/" + user.getId()))
                                .andExpect(status().isNotFound());
        }

        @Test
        void save_ShouldReturnNotFoundIfIdDoesNotExist() throws Exception {
                UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername("test@test.com")
                                .password("password")
                                .authorities(Collections.emptyList())
                                .build();
                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(userDetails, null,
                                                userDetails.getAuthorities()));

                mockMvc.perform(delete("/api/user/42"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void save_ShouldReturnUnauthorizedErrorWhenConnectedUserDoesNotHaveCorrectId() throws Exception {
                User user = new User();
                user.setEmail("test@test.com");
                user.setAdmin(true);
                user.setFirstName("Test");
                user.setLastName("TEST");
                user.setPassword("password");
                user = userRepository.save(user);

                UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername("test2@test.com")
                                .password("password")
                                .authorities(Collections.emptyList())
                                .build();
                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(userDetails, null,
                                                userDetails.getAuthorities()));

                mockMvc.perform(delete("/api/user/" + user.getId()))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        void delete_ShouldReturnBadRequestIfIdIsNotCorrect() throws Exception {
                UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername("test@test.com")
                                .password("password")
                                .authorities(Collections.emptyList())
                                .build();
                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(userDetails, null,
                                                userDetails.getAuthorities()));

                mockMvc.perform(delete("/api/user/wrong"))
                                .andExpect(status().isBadRequest());
        }
}