package com.example.BGF.service;

import com.example.BGF.models.AppService;
import com.example.BGF.models.User;
import com.example.BGF.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public AppService addService(AppService service, User user) {
        if (service.getServiceName() == null || service.getServiceName().isBlank()) {
            throw new IllegalArgumentException("Service name cannot be null or empty");
        }
        if (user==null){
            throw new IllegalArgumentException("User cannot be null or empty");
        }
        service.setUser(user); // set the user
        return serviceRepository.save(service);
    }

    public List<AppService> getAllServices() {
        return serviceRepository.findAll();
    }
}