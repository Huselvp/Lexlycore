package com.iker.Lexly.Controller;

import com.iker.Lexly.Entity.User;
import com.iker.Lexly.repository.RoleRepository;
import com.iker.Lexly.repository.UserRepository;
import com.iker.Lexly.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/api/user")
public class userController {
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    userService userService;

    @GetMapping("/email/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }
    @PostMapping
    public String post(){
        return "GET :: suser controller";
    }
    @PutMapping
    public String put(){
        return "GET :: suser controller";
    }
    @DeleteMapping
    public String Delete(){
        return "GET :: suser controller";
    }
}
