package com.agrirent.equipment_service.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.agrirent.equipment_dto.EquipmentResponseDTO;
import com.agrirent.equipment_service.entity.Equipment;

public interface EquipmentService {

    List<Equipment> getAllEquipment();

    List<Equipment> getByType(String type);

    List<Equipment> getByLocation(String location);

    EquipmentResponseDTO getEquipmentById(Long id);

    Equipment addEquipment(String name, String type, String location, Double pricePerDay, Boolean available,
            MultipartFile image) throws IOException;

    void deleteEquipment(Long id) throws IOException;
}
