package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Mock
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setPassword("password");
        user.setFirstName("firstname");
        user.setLastName("lastname");
        user.setAdmin(false);
    }

    @Test
    void dtoToUser_ShouldReturnUser_AndNullIfDtoIsNull() {
        UserDto userDto = new UserDto();
        userDto.setEmail("email@email.com");
        userDto.setId(1L);
        userDto.setAdmin(false);
        userDto.setFirstName("firstname");
        userDto.setLastName("lastname");
        userDto.setPassword("password");

        User user = userMapper.toEntity(userDto);

        assertNotNull(user);
        assertEquals(userDto.getId(), user.getId());
        assertNull(userMapper.toEntity((UserDto) null));
    }

    @Test
    void userToDTO_ShouldReturnDtoIfUser_AndNullIfUserIsNull() {
        UserDto userDto = userMapper.toDto(user);
        assertNotNull(userDto);
        assertEquals(user.getId(), userDto.getId());
        assertNull(userMapper.toDto((User) null));
    }

    @Test
    void dtoToUserList_ShouldReturnList_AndNullIfListIsNull() {
        UserDto userDto = new UserDto();
        userDto.setEmail("test@test.com");
        userDto.setId(1L);
        userDto.setAdmin(false);
        userDto.setFirstName("firstname");
        userDto.setLastName("lastname");
        userDto.setPassword("password");
        List<UserDto> userDtoList = new ArrayList<>();
        userDtoList.add(userDto);

        List<User> userList = userMapper.toEntity(userDtoList);
        assertNotNull(userList);
        assertEquals(userDtoList.get(0).getId(), userList.get(0).getId());
        assertNull(userMapper.toDto((List<User>) null));
    }

    @Test
    void userListToDto() {
        List<User> userList = new ArrayList<>();
        userList.add(user);
        List<UserDto> userDtoList = userMapper.toDto(userList);
        assertNotNull(userDtoList);
        assertEquals(userList.get(0).getId(), userDtoList.get(0).getId());
    }
}