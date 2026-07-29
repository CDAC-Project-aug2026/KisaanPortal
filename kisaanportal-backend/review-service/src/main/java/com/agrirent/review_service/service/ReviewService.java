package com.agrirent.review_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.agrirent.review_service.entity.Review;
import com.agrirent.review_service.repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repo;

    public Review addReview(Review review) {
        return repo.save(review);
    }

    public List<Review> getAllReviews() {
        return repo.findAll();
    }
}