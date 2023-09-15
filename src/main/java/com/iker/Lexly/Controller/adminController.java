package com.iker.Lexly.Controller;

import com.iker.Lexly.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")

public class adminController {
    @Autowired
    RoleRepository roleRepository;
    @GetMapping
    public String get(){
        return "GET :: admin controller";
    }
    @PostMapping
    public String post(){
        return "GET :: admin controller";
    }
    @PutMapping
    public String put(){
        return "GET :: admin controller";
    }
    @DeleteMapping
    public String Delete(){
        return "GET :: admin controller";
    }

}
