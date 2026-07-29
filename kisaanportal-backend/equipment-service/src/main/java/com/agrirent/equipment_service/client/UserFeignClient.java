package com.agrirent.equipment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.agrirent.equipment_dto.UserDTO;

@FeignClient(name = "AUTH-SERVICE")
public interface UserFeignClient {

    @GetMapping("/users/{id}")
    UserDTO getUserById(
            @PathVariable Long id);
}