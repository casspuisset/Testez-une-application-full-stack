package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    void create_ShouldReturnTheCreatedSession() {
        Session session = Session.builder()
                .name("Test")
                .date(new Date())
                .description("Description")
                .build();

        Session savedSession = Session.builder()
                .id(1L)
                .name("Test")
                .date(session.getDate())
                .description("Description")
                .build();

        when(sessionRepository.save(session)).thenReturn(savedSession);

        Session createdSession = sessionService.create(session);

        assertNotNull(createdSession);
        assertEquals(savedSession.getId(), createdSession.getId());
        assertEquals(session.getName(), createdSession.getName());
        assertEquals(session.getDate(), createdSession.getDate());
        assertEquals(session.getDescription(), createdSession.getDescription());
    }

    @Test
    void delete_ShouldDeleteTheSessionByCallingDeleteByIdWithTheId() {
        Long sessionId = 1L;

        sessionService.delete(sessionId);

        verify(sessionRepository).deleteById(sessionId);
    }

    @Test
    void getById_ShouldReturnSessionIfTheIDExists_AndNullIfTheIDDoesNotExist() {
        Session expectedSession = Session.builder()
                .id(1L)
                .name("Test")
                .date(new Date())
                .description("Description")
                .build();

        when(sessionRepository.findById(1L)).thenReturn(java.util.Optional.of(expectedSession));

        Session session = sessionService.getById(1L);

        assertNotNull(session);
        assertEquals(expectedSession.getId(), session.getId());
        verify(sessionRepository).findById(1L);

        // case Id does not exist
        when(sessionRepository.findById(1L)).thenReturn(null);

        var session2 = sessionRepository.findById(1L);

        assertNull(session2);
    }

    @Test
    void findAll_ShouldReturnAllSessions() {
        Session session = Session.builder()
                .id(1L)
                .name("Test")
                .date(new Date())
                .description("Description")
                .build();

        Session session2 = Session.builder()
                .id(2L)
                .name("Test 2")
                .date(new Date())
                .description("Description 2")
                .build();

        List<Session> expectedSessions = Arrays.asList(session, session2);

        when(sessionRepository.findAll()).thenReturn(expectedSessions);

        List<Session> sessions = sessionService.findAll();

        assertNotNull(sessions);
        assertEquals(2, sessions.size());
        verify(sessionRepository).findAll();
    }

    @Test
    void update_ShouldReturnUpdatedSession() {
        Session session = Session.builder()
                .id(1L)
                .name("Session")
                .date(new Date())
                .description("Description")
                .build();

        when(sessionRepository.save(session)).thenReturn(session);

        Session updatedSession = sessionService.update(1L, session);

        assertNotNull(updatedSession);
        assertEquals(1L, updatedSession.getId());
        assertEquals("Session", updatedSession.getName());
        assertEquals("Description", updatedSession.getDescription());

    }

    @Test
    void participate_ShouldAddNewUserToSessionWhenUserDoesNotAlreadyParticipe_AndThrowANotFoundExceptionIfUserOrSessionIsNull() {

        User user = new User();
        user.setId(1L);

        Session session = Session.builder()
                .id(1L)
                .name("Session")
                .date(new Date())
                .description("Description")
                .users(new ArrayList<>())
                .build();

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(session)).thenReturn(session);

        sessionService.participate(session.getId(), user.getId());

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository).save(session);

        // case user null
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 2L));

        // case session null
        when(sessionRepository.findById(2L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        assertThrows(NotFoundException.class, () -> sessionService.participate(2L, 1L));
    }

    @Test
    void participate_ShouldThrowABadRequestExceptionIfUserAlreadyRegister() {
        User user = new User();
        Session session = new Session();
        session.setId(1L);
        user.setId(1L);
        session.setUsers(new ArrayList<>(Collections.singletonList(user)));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void noLongerParticipate_ShouldRemovesUserFromSessionUsersArray_AndThrowANotFoundExceptionIfSessionIsNull() {
        User user = new User();
        user.setId(1L);

        Session session = Session.builder()
                .id(1L)
                .name("Test")
                .date(new Date())
                .description("Description")
                .users(new ArrayList<>(Collections.singletonList(user)))
                .build();

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(session)).thenReturn(session);

        sessionService.noLongerParticipate(1L, 1L);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository).save(session);

        // case session null
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
    }

    @Test
    void noLongerParticipate_ShouldThrowABadRequestExceptionIfUserIsNotAlreadyRegister() {
        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));

    }
}