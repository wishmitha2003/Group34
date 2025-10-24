package com.example.BGF.repository;

import com.example.BGF.models.AppService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<AppService, Long> {
}
