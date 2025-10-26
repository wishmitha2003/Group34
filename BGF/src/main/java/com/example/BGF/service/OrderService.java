package com.example.BGF.service;

import com.example.BGF.models.AppService;
import com.example.BGF.models.Order;
import com.example.BGF.models.User;
import com.example.BGF.repository.OrderRepository;
import com.example.BGF.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ServiceRepository serviceRepository;

    public OrderService(OrderRepository orderRepository, ServiceRepository serviceRepository) {
        this.orderRepository = orderRepository;
        this.serviceRepository = serviceRepository;
    }

    // Create a new order
    public Order createOrder(Long userId, Long productId, Integer quantity, String shippingAddress, String paymentMethod, String notes) {
        // This method would be called from controller with proper user validation
        User user = new User(); // This should come from authenticated user
        user.setId(userId);
        
        AppService product = serviceRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock availability
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }

        // Create order
        Order order = new Order(user, product, quantity, product.getPrice());
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setNotes(notes);

        // Update product stock
        product.setStock(product.getStock() - quantity);
        serviceRepository.save(product);

        return orderRepository.save(order);
    }

    @Transactional
    public Order placeOrder(Order order, User user) {
        order.setUser(user);

        // Validate and set product details
        if (order.getProduct() != null && order.getProduct().getId() != null) {
            AppService product = serviceRepository.findById(order.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Check stock
            if (product.getStock() < order.getQuantity()) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
            }
            
            order.setProduct(product);
            order.setPrice(product.getPrice());
            order.setTotalAmount(order.getQuantity() * product.getPrice());
            
            // Update stock
            product.setStock(product.getStock() - order.getQuantity());
            serviceRepository.save(product);
        }

        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Get all orders for a user
    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    // Get all orders (admin)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    // Get order by ID
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    // Update order status
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // Cancel order
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equals(order.getStatus()) && !"CONFIRMED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        // Restore stock
        AppService product = order.getProduct();
        product.setStock(product.getStock() + order.getQuantity());
        serviceRepository.save(product);

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}
