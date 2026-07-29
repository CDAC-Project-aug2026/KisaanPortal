package com.agrirent.review_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agrirent.review_service.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
}