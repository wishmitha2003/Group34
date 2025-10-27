package com.example.BGF.service;

import com.example.BGF.models.Order;
import com.example.BGF.models.Product;
import com.example.BGF.models.User;
import com.example.BGF.repository.OrderRepository;
import com.example.BGF.repository.ProductRepository;
import com.example.BGF.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Order createOrder(Long userId, Long productId, int quantity, String shippingAddress, String paymentMethod, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity <= 0) throw new RuntimeException("Quantity must be greater than 0");

        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(quantity);

        // ✅ Fixed price and total amount
        order.setPrice(product.getPrice()); // unit price
        order.setTotalAmount(product.getPrice() * quantity); // total price

        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setNotes(notes);
        order.setStatus("PENDING");

        return orderRepository.save(order);
    }


    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }


    public List<Order> getOrdersForUser(User user) {
        return orderRepository.findByUser(user);
    }
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}
