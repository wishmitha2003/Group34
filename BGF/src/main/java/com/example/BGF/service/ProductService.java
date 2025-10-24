package com.example.BGF.service;

import com.example.BGF.models.Product;
import com.example.BGF.models.User;
import com.example.BGF.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Create
    public Product addProduct(Product product, User admin) {
        if (product.getName() == null || product.getName().isBlank()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        product.setAdmin(admin);
        return productRepository.save(product);
    }

    // Read all
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Read by id
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Update
    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (updatedProduct.getPrice() != null)
            product.setPrice(updatedProduct.getPrice());
        if (updatedProduct.getStock() != null)
            product.setStock(updatedProduct.getStock());
        if (updatedProduct.getDescription() != null)
            product.setDescription(updatedProduct.getDescription());

        return productRepository.save(product);
    }

    // Delete
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Search by name
    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Filter by category
    public List<Product> filterByCategory(String category) {
        return productRepository.findByCategoryContainingIgnoreCase(category);
    }
}
