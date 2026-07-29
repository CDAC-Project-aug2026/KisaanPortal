package com.agrirent.review_service.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.agrirent.review_service.entity.Review;
import com.agrirent.review_service.service.ReviewService;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService service;

    @PostMapping("/add")
    public Review addReview(@Valid @RequestBody Review review) {
        return service.addReview(review);
    }

    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return service.getAllReviews();
    }
}