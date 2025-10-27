package com.example.BGF.repository;

import com.example.BGF.models.Order;
import com.example.BGF.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
