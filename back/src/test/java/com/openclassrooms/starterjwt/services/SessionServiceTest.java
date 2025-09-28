package com.openclassrooms.starterjwt.services;

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
    void getById_ShouldReturnSessionIfTheIDExists() {
        Long sessionId = 1L;
        Session expectedSession = Session.builder()
                .id(sessionId)
                .name("Test")
                .date(new Date())
                .description("Description")
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(java.util.Optional.of(expectedSession));

        Session session = sessionService.getById(sessionId);

        assertNotNull(session);
        assertEquals(expectedSession.getId(), session.getId());
        verify(sessionRepository).findById(sessionId);
    }

    @Test
    void getById_ShouldReturnNullIfTheIDDoesNotExist() {

        var session = sessionService.getById(1L);

        assertNull(session);
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
    void participateSession_ShouldAddNewUserToSessionWhenUserDoesNotAlreadyParticipe() {

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
    }

    // @Test
    // void
    // participateSession_ShouldReturnBadRequestExceptionIfUserAlreadyParticipe() {

    // User user = new User();
    // user.setId(1L);

    // Session session = Session.builder()
    // .id(1L)
    // .name("Test Session")
    // .date(new Date())
    // .description("Description")
    // .users(new ArrayList<>(Collections.singletonList(user)))
    // .build();

    // when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
    // when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    // when(sessionRepository.save(session)).thenReturn(session);

    // sessionService.participate(session.getId(), user.getId());

    // assertTrue(session.getUsers().contains(user));
    // verify(sessionRepository).save(session);
    // assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

    // }

    @Test
    void unparticipateSession_ShouldRemovesUserFromSessionUsersArray() {
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
    }
}