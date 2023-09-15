package com.iker.Lexly.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/superadmin")
public class superadminController {
    @GetMapping
    public String get(){
        return " GET:: superadmin controller";

    }
    @PostMapping
    public String post(){
        return "POST :: superadmin controller";
    }
    @PutMapping
    public String put(){
        return "PUT:: superadmin controller";

    }
    @DeleteMapping
    public String delete(){
        return "DELETE :: superadmin controller";
    }
}
