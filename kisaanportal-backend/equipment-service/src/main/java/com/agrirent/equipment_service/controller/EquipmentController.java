package com.agrirent.equipment_service.controller;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.agrirent.equipment_dto.EquipmentResponseDTO;
import com.agrirent.equipment_service.entity.Equipment;
import com.agrirent.equipment_service.service.EquipmentService;

@RestController
@RequestMapping("/equipment")
public class EquipmentController {

    private static final Logger logger =
            LoggerFactory.getLogger(EquipmentController.class);

    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Equipment> addEquipment(
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("location") String location,
            @RequestParam("pricePerDay") Double pricePerDay,
            @RequestParam("available") Boolean available,
            @RequestParam("image") MultipartFile image
    ) throws IOException {

        Equipment createdEquipment = service.addEquipment(
                name,
                type,
                location,
                pricePerDay,
                available,
                image
        );
        return ResponseEntity.ok(createdEquipment);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteEquipment(@PathVariable Long id) throws IOException {

        logger.info("REST request to delete equipment with id: {}", id);

        service.deleteEquipment(id);
        return ResponseEntity.ok("Equipment deleted successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Equipment>> getAllEquipment() {

        logger.info("REST request to get all equipment");

        return ResponseEntity.ok(
                service.getAllEquipment());
    }

//    @GetMapping("/type/{type}")
//    public ResponseEntity<List<Equipment>> getByType(
//            @PathVariable String type) {
//
//        logger.info(
//                "REST request to get equipment by type: {}",
//                type);
//
//        return ResponseEntity.ok(
//                service.getByType(type));
//    }
    @GetMapping("/type/{type}")
    public List<Equipment> getByType(@PathVariable String type) {
        return service.getByType(type);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Equipment>> getByLocation(
            @PathVariable String location) {

        logger.info(
                "REST request to get equipment by location: {}",
                location);

        return ResponseEntity.ok(
                service.getByLocation(location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponseDTO> getEquipment(
            @PathVariable Long id) {

        logger.info(
                "REST request to get equipment by id: {}",
                id);

        return ResponseEntity.ok(
                service.getEquipmentById(id));
    }
}