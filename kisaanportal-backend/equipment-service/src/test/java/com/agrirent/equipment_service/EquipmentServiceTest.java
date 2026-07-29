package com.agrirent.equipment_service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.agrirent.equipment_service.client.UserFeignClient;
import com.agrirent.equipment_service.entity.Equipment;
import com.agrirent.equipment_service.exception.ResourceNotFoundException;
import com.agrirent.equipment_service.repository.EquipmentRepository;
import com.agrirent.equipment_service.service.EquipmentService;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceTest {

    @Mock
    private EquipmentRepository repo;

    @Mock
    private UserFeignClient userFeignClient;

    @InjectMocks
    private EquipmentService service;

    private Equipment equipment;

    @BeforeEach
    void setUp() {

        equipment = new Equipment();

        equipment.setId(1L);
        equipment.setName("Tractor");
        equipment.setType("tractor");
        equipment.setLocation("Pune");
        equipment.setPricePerDay(2500.0);
        equipment.setAvailable(true);
        equipment.setImageUrl("tractor.jpg");
        equipment.setOwnerId(101L);
    }

//    @Test
//    void testAddEquipment() {
//
//        when(repo.save(any(Equipment.class)))
//                .thenReturn(equipment);
//
//        Equipment savedEquipment =
//                service.addEquipment(equipment);
//
//        assertNotNull(savedEquipment);
//        assertEquals("Tractor",
//                savedEquipment.getName());
//    }

    @Test
    void testGetByLocation_Success() {

        List<Equipment> list =
                new ArrayList<>();

        list.add(equipment);

        when(repo.findByLocation("Pune"))
                .thenReturn(list);

        List<Equipment> result =
                service.getByLocation("Pune");

        assertEquals(1, result.size());

        assertEquals("Pune",
                result.get(0).getLocation());
    }

    @Test
    void testGetByLocation_ThrowsException() {

        when(repo.findByLocation("Mumbai"))
                .thenReturn(new ArrayList<>());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getByLocation("Mumbai"));
    }
}