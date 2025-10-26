package com.example.BGF.repository;

import com.example.BGF.models.Order;
import com.example.BGF.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserOrderByOrderDateDesc(User user);
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findByStatus(String status);
    
    @Query("SELECT o FROM Order o WHERE o.user.id = ?1")
    List<Order> findByUserId(Long userId);
}
