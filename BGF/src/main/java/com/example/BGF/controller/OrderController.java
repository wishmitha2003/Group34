package com.example.BGF.controller;

import com.example.BGF.models.Order;
import com.example.BGF.models.User;
import com.example.BGF.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/user/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order, @AuthenticationPrincipal User user) {
        Order newOrder = orderService.placeOrder(order, user);
        return ResponseEntity.ok(newOrder);
    }

    @GetMapping("/user/all")
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrdersByUser(user));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
