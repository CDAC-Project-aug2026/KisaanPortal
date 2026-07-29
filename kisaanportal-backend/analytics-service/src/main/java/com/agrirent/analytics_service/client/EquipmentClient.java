package com.agrirent.analytics_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "EQUIPMENT-SERVICE")
public interface EquipmentClient {

    @GetMapping("/equipment/type/{type}")
    List<Object> getByType(@PathVariable String type);
}