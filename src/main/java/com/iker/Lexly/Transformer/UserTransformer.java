package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class UserTransformer extends Transformer<User, UserDTO> {


    @Override
    public User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        } else {
            User user = new User();
            user.setUserId(dto.getUserId());
            user.setEmail(dto.getEmail());
            user.setFirstname(dto.getFirstname());
            user.setLastname(dto.getLastname());
            user.setPassword(dto.getPassword());
            user.setPhonenumber(dto.getPhonenumber());
            user.setPicture(dto.getPicture());
            user.setRole(dto.getRole());
            user.setUsername(dto.getUsername());
            user.setAdress(dto.getAdress());
            user.setTown(dto.getTown());
            user.setCountry(dto.getCountry());
            return user;
        }
    }

    @Override
    public UserDTO toDTO(User entity) {
        if (entity == null) {
            return null;
        } else {

            return new UserDTO(entity.getCountry(),entity.getDescription(),entity.getZipcode(),entity.getTown(),entity.getAdress(),entity.getUsername(), entity.getRole(),entity.getUserId(), entity.getEmail(),
                    entity.getFirstname(), entity.getLastname(), entity.getPicture(), entity.getPhonenumber());
        }

    }
}
