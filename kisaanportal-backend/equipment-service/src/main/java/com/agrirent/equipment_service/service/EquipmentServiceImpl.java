package com.agrirent.equipment_service.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.agrirent.equipment_dto.EquipmentResponseDTO;
import com.agrirent.equipment_dto.UserDTO;
import com.agrirent.equipment_service.client.UserFeignClient;
import com.agrirent.equipment_service.entity.Equipment;
import com.agrirent.equipment_service.exception.ResourceNotFoundException;
import com.agrirent.equipment_service.repository.EquipmentRepository;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private static final Logger logger =
            LoggerFactory.getLogger(EquipmentServiceImpl.class);

    private final EquipmentRepository repo;
    private final UserFeignClient userFeignClient;
    
    private final String UPLOAD_DIR = "uploads/";

    public EquipmentServiceImpl(EquipmentRepository repo,
                                UserFeignClient userFeignClient) {
        this.repo = repo;
        this.userFeignClient = userFeignClient;
    }

    @Override
    public Equipment addEquipment(String name, String type, String location, Double pricePerDay, Boolean available, MultipartFile image) throws IOException {

        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

        Files.copy(image.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        Equipment equipment = new Equipment();

        equipment.setName(name);
        equipment.setType(type);
        equipment.setLocation(location);
        equipment.setPricePerDay(pricePerDay);
        equipment.setAvailable(available);
        equipment.setImageUrl(fileName);

        return repo.save(equipment);
    }   

    @Override
    public void deleteEquipment(Long id) throws IOException {
        Equipment equipment = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipment not found with id: " + id));

        String imageUrl = equipment.getImageUrl();
        if (imageUrl != null && !imageUrl.isBlank()) {
            Path imagePath = Paths.get(UPLOAD_DIR).resolve(imageUrl);
            Files.deleteIfExists(imagePath);
        }

        repo.delete(equipment);
    }

    @Override
    public List<Equipment> getAllEquipment() {
        logger.info("Fetching all equipment");
        return repo.findAll();
    }

    @Override
    public List<Equipment> getByType(String type) {
        logger.info("Fetching equipment by type: {}", type);
        // Case-insensitive search that returns an empty list [] when nothing is found
        return repo.findByTypeContainingIgnoreCase(type); 
    }

    @Override
    public List<Equipment> getByLocation(String location) {
        logger.info("Fetching equipment by location: {}", location);
        return repo.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public EquipmentResponseDTO getEquipmentById(Long id) {
        logger.info("Fetching equipment with id: {}", id);

        Equipment equipment = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipment not found with id: " + id));

        UserDTO owner = null;
        try {
            owner = userFeignClient.getUserById(equipment.getOwnerId());
        } catch (Exception e) {
            logger.warn("Could not fetch owner details from auth-service for ownerId {}: {} - {}",
                    equipment.getOwnerId(), e.getClass().getSimpleName(), e.getMessage());
        }

        return new EquipmentResponseDTO(
                equipment,
                owner);
    }
}