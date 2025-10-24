package com.example.BGF.controller;

import com.example.BGF.models.AppService;
import com.example.BGF.models.User;
import com.example.BGF.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private  ServiceService serviceService;

    @PostMapping("/admin/add")
    public ResponseEntity<AppService> addService(@RequestBody AppService service, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(serviceService.addService(service, user));
    }

    @GetMapping("/user/all")
    public ResponseEntity<List<AppService>> getAll() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }
}