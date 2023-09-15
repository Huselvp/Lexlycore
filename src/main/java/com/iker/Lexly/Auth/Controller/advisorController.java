package com.iker.Lexly.Auth.Controller;

import com.iker.Lexly.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/advisor")
public class advisorController {
    @Autowired
    RoleRepository roleRepository;
    @GetMapping
    public String get(){
        return "GET :: advisor controller";
    }
    @PostMapping
    public String post(){
        return "GET :: advisor controller";
    }
    @PutMapping
    public String put(){
        return "GET :: advisor controller";
    }
    @DeleteMapping
    public String Delete(){
        return "GET :: advisor controller";
    }
}
