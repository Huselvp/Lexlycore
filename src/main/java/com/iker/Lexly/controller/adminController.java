package com.iker.Lexly.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class adminController {
    @GetMapping
    public String get(){
        return " GET:: admin controller";

    }
    @PostMapping
    public String post(){
        return "POST :: admin controller";
    }
    @PutMapping
    public String put(){
        return "PUT:: admin controller";

    }
    @DeleteMapping
    public String delete(){
        return "DELETE :: admin controller";
    }
}
