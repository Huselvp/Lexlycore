package com.iker.Lexly.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suser")
public class suserController {
    @GetMapping
    public String get(){
        return " GET:: suser controller";

    }
    @PostMapping
    public String post(){
        return "POST :: suser controller";
    }
    @PutMapping
    public String put(){
        return "PUT:: suser controller";

    }
    @DeleteMapping
    public String delete(){
        return "DELETE :: suser controller";
    }

}
