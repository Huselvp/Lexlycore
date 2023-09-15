package com.iker.Lexly.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/advisor")
public class advisorController {
    @GetMapping
    public String get(){
        return " GET:: advisor controller";

    }
    @PostMapping
    public String post(){
        return "POST :: advisor controller";
    }
    @PutMapping
    public String put(){
        return "PUT:: advisor controller";

    }
    @DeleteMapping
    public String delete(){
        return "DELETE :: advisor controller";
    }

}
