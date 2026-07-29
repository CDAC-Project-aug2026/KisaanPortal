package com.agrirent.review_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import com.agrirent.review_service.entity.Review;
import com.agrirent.review_service.repository.ReviewRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository repo;

    @InjectMocks
    private ReviewService service;

    @Test
    void testGetAllReviews() {

        Review r1 = new Review();
        Review r2 = new Review();

        when(repo.findAll()).thenReturn(Arrays.asList(r1, r2));

        List<Review> reviews = service.getAllReviews();

        assertEquals(2, reviews.size());
    }

    @Test
    void testAddReview() {

        Review review = new Review();

        when(repo.save(review)).thenReturn(review);

        Review saved = service.addReview(review);

        assertEquals(review, saved);
    }
}