package com.iker.Lexly.Controller;

import com.iker.Lexly.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/user")
public class userController {
    @Autowired
    RoleRepository roleRepository;
    @GetMapping
    public String get(){
        return "GET :: suser controller";
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
