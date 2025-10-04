package com.openclassrooms.starterjwt.IT;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class TeacherControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    @BeforeEach
    void setUp() {
        teacherRepository.deleteAll();
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

    @Test
    void findById_ShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/teacher/42"))
                .andExpect(status().isNotFound());
    }

    @Test
    void findById_ShouldReturnBadRequestWhenIdIsIncorrect() throws Exception {
        mockMvc.perform(get("/api/teacher/wrong"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void findAll_ShouldReturnListOfAllSavedTeachers() throws Exception {
        Teacher teacher = new Teacher();
        Teacher teacher2 = new Teacher();
        teacher.setLastName("TEST");
        teacher.setFirstName("Test");
        teacher2.setLastName("TEST2");
        teacher2.setFirstName("Test2");
        teacherRepository.save(teacher);
        teacherRepository.save(teacher2);

        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void findAll_ShouldReturnEmptyListWhenThereIsNoTeacher() throws Exception {
        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}