package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void findById_ShouldReturnUserIfIdExists() {

        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User returnedUser = userService.findById(1L);

        assertNotNull(returnedUser);
        assertEquals(user, returnedUser);
        verify(userRepository).findById(1L);
    }

    @Test
    void findById_ShouldReturnNullIfIdDoesNotExist() {

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        User userActual = userService.findById(1L);

        assertNull(userActual);
        verify(userRepository).findById(1L);
    }

    @Test
    void delete_ShouldCallDeleteByIdWithGivenId() {
        userService.delete(1L);

        verify(userRepository).deleteById(1L);
    }

}