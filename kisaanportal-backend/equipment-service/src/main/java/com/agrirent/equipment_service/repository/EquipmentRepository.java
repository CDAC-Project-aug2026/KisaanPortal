package com.agrirent.equipment_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agrirent.equipment_service.entity.Equipment;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByType(String type);

    List<Equipment> findByLocation(String location);
    
    List<Equipment> findByTypeContainingIgnoreCase(String type);
    List<Equipment> findByLocationContainingIgnoreCase(String location);
}