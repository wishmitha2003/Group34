package com.example.BGF.repository;

import com.example.BGF.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find reviews by product
    List<Review> findByProductId(Long productId);

    // Find reviews by user
    List<Review> findByUserId(Long userId);
}
