package com.example.BGF.controller;

import com.example.BGF.models.Order;
import com.example.BGF.models.User;
import com.example.BGF.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Long userId = Long.valueOf(orderData.get("userId").toString());
            Long productId = Long.valueOf(orderData.get("productId").toString());
            int quantity = Integer.parseInt(orderData.get("quantity").toString());
            String shippingAddress = (String) orderData.get("shippingAddress");
            String paymentMethod = (String) orderData.get("paymentMethod");
            String notes = (String) orderData.getOrDefault("notes", "");

            Order order = orderService.createOrder(userId, productId, quantity, shippingAddress, paymentMethod, notes);
            return ResponseEntity.ok(Map.of(
                    "message", "Order created successfully",
                    "order", order
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body((Order) Map.of("error", "Order not found")));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return ResponseEntity.ok(orderService.getOrdersByUser(user));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            Order updated = orderService.updateOrderStatus(id, statusData.get("status"));
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            Order cancelled = orderService.cancelOrder(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Order cancelled successfully",
                    "order", cancelled
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
