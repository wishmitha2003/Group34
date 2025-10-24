package com.example.BGF.service;

import com.example.BGF.models.AppService;
import com.example.BGF.models.Order;
import com.example.BGF.models.OrderItem;
import com.example.BGF.models.User;
import com.example.BGF.repository.OrderRepository;
import com.example.BGF.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ServiceRepository serviceRepository;

    public OrderService(OrderRepository orderRepository, ServiceRepository serviceRepository) {
        this.orderRepository = orderRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public Order placeOrder(Order order, User user) {
        order.setUser(user);

        if(order.getOrderItems() != null) {
            for(OrderItem item : order.getOrderItems()) {
                AppService product = serviceRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                item.setProduct(product);
                item.setPrice(product.getPrice() * item.getQuantity());
                item.setOrder(order);
            }
        }

        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
