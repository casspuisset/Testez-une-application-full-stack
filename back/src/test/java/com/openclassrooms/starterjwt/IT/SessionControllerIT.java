package com.openclassrooms.starterjwt.IT;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Date;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class SessionControllerIT {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private SessionRepository sessionRepository;

        @Autowired
        private TeacherRepository teacherRepository;

        @Autowired
        private ObjectMapper objectMapper;

        @BeforeEach
        void setUp() {
                sessionRepository.deleteAll();
        }

        @Test
        void findById_ShouldReturnSessionWhenIdExists() throws Exception {

                Session session = new Session();
                session.setName("Session");
                session.setDate(new Date());
                session.setDescription("description");
                sessionRepository.save(session);
                SessionDto sessionDto = new SessionDto();
                sessionDto.setDate(new Date());
                sessionDto.setTeacher_id(1L);
                sessionDto.setDescription("description");
                sessionDto.setName("Session");

                mockMvc.perform(get("/api/session/" + session.getId()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Session"));
        }

        @Test
        void findById_ShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
                mockMvc.perform(get("/api/session/42"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void findById_ShouldReturnBadRequest() throws Exception {
                mockMvc.perform(get("/api/session/wrong"))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void findAll_ShouldReturnAllSessionsOfTheList() throws Exception {
                Session session = new Session();
                Session session2 = new Session();
                session.setName("Session");
                session.setDate(new Date());
                session.setDescription("description");
                session2.setName("Session2");
                session2.setDate(new Date());
                session2.setDescription("description2");
                sessionRepository.save(session);
                sessionRepository.save(session2);

                mockMvc.perform(get("/api/session"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(2)));
        }

        @Test
        void findAll_ShouldReturnEmptyListIfListIsEmpty() throws Exception {

                mockMvc.perform(get("/api/session"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(0)));
        }

        @Test
        void create_ShouldCreateASession() throws Exception {
                SessionDto sessionDto = new SessionDto();
                sessionDto.setDate(new Date());
                sessionDto.setTeacher_id(1L);
                sessionDto.setDescription("description");
                sessionDto.setName("Session");

                mockMvc.perform(post("/api/session")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(sessionDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Session"));
        }

        @Test
        void update_ShouldModifySession() throws Exception {
                Session session = new Session();
                session.setName("Session");
                session.setDate(new Date());
                session.setDescription("description");
                session = sessionRepository.save(session);

                SessionDto sessionDto = new SessionDto();
                sessionDto.setDate(new Date());
                sessionDto.setTeacher_id(1L);
                sessionDto.setDescription("description");
                sessionDto.setName("Session 2");
                mockMvc.perform(put("/api/session/" + session.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(sessionDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Session 2"));
        }

        @Test
        void update_ShouldReturnBadRequestErrorWhenIdIsNotCorrect() throws Exception {
                SessionDto sessionDto = new SessionDto();
                sessionDto.setDate(new Date());
                sessionDto.setTeacher_id(1L);
                sessionDto.setDescription("description");
                sessionDto.setName("Session");

                mockMvc.perform(put("/api/session/wrong")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(sessionDto)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void delete_ShouldDeleteSessionWithCorrectId() throws Exception {
                Session session = new Session();
                session.setName("Session");
                session.setDate(new Date());
                session.setDescription("description");
                session = sessionRepository.save(session);

                mockMvc.perform(delete("/api/session/" + session.getId()))
                                .andExpect(status().isOk());

                mockMvc.perform(get("/api/session/" + session.getId()))
                                .andExpect(status().isNotFound());
        }

        @Test
        void delete_ShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
                mockMvc.perform(delete("/api/session/42"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void delete_ShouldReturnBadRequestWhenIdIsNotCorrect() throws Exception {
                mockMvc.perform(delete("/api/session/wrong"))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void findById_ShouldReturnTeacherWithTheCorrectId() throws Exception {
                Teacher teacher = new Teacher();
                teacher.setLastName("TEST");
                teacher.setFirstName("Test");
                teacher = teacherRepository.save(teacher);

                mockMvc.perform(get("/api/teacher/" + teacher.getId()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.lastName").value("TEST"))
                                .andExpect(jsonPath("$.firstName").value("Test"));
        }
}