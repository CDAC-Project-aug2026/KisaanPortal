package com.agrirent.equipment_service.controller;

import com.agrirent.equipment_dto.EquipmentResponseDTO;
import com.agrirent.equipment_service.entity.Equipment;
import com.agrirent.equipment_service.service.EquipmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EquipmentController.class)
class EquipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EquipmentService service;

    private Equipment sampleEquipment;

    @BeforeEach
    void setUp() {
        sampleEquipment = new Equipment();
        sampleEquipment.setId(1L);
        sampleEquipment.setName("Tractor 5000");
        sampleEquipment.setType("Tractor");
        sampleEquipment.setLocation("Dallas");
        sampleEquipment.setPricePerDay(150.0);
        sampleEquipment.setAvailable(true);
    }

   
    @Nested
    @DisplayName("POST /equipment/add")
    class AddEquipmentTests {

        @Test
        @DisplayName("Should add equipment with multipart file and return 200 OK")
        void addEquipment_Success() throws Exception {
            MockMultipartFile mockFile = new MockMultipartFile(
                    "image",
                    "tractor.png",
                    "image/png",
                    "dummy image content".getBytes()
            );

            when(service.addEquipment(
                    eq("Tractor 5000"),
                    eq("Tractor"),
                    eq("Dallas"),
                    eq(150.0),
                    eq(true),
                    any(MultipartFile.class)
            )).thenReturn(sampleEquipment);

            mockMvc.perform(multipart("/equipment/add")
                            .file(mockFile)
                            .param("name", "Tractor 5000")
                            .param("type", "Tractor")
                            .param("location", "Dallas")
                            .param("pricePerDay", "150.0")
                            .param("available", "true"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(sampleEquipment.getId()))
                    .andExpect(jsonPath("$.name").value(sampleEquipment.getName()))
                    .andExpect(jsonPath("$.type").value(sampleEquipment.getType()));

            verify(service).addEquipment(
                    eq("Tractor 5000"),
                    eq("Tractor"),
                    eq("Dallas"),
                    eq(150.0),
                    eq(true),
                    any(MultipartFile.class)
            );
        }
    }

    @Nested
    @DisplayName("GET Endpoints")
    class GetEndpointsTests {

        @Test
        @DisplayName("GET /equipment/all - Should return list of equipment")
        void getAllEquipment_Success() throws Exception {
            when(service.getAllEquipment()).thenReturn(List.of(sampleEquipment));

            mockMvc.perform(get("/equipment/all"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.size()").value(1))
                    .andExpect(jsonPath("$[0].name").value("Tractor 5000"));

            verify(service).getAllEquipment();
        }

        @Test
        @DisplayName("GET /equipment/type/{type} - Should return list by type")
        void getByType_Success() throws Exception {
            String type = "Tractor";
            when(service.getByType(type)).thenReturn(List.of(sampleEquipment));

            mockMvc.perform(get("/equipment/type/{type}", type))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.size()").value(1))
                    .andExpect(jsonPath("$[0].type").value(type));

            verify(service).getByType(type);
        }

        @Test
        @DisplayName("GET /equipment/location/{location} - Should return list by location")
        void getByLocation_Success() throws Exception {
            String location = "Dallas";
            when(service.getByLocation(location)).thenReturn(List.of(sampleEquipment));

            mockMvc.perform(get("/equipment/location/{location}", location))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.size()").value(1))
                    .andExpect(jsonPath("$[0].location").value(location));

            verify(service).getByLocation(location);
        }

        @Test
        @DisplayName("GET /equipment/{id} - Should return EquipmentResponseDTO")
        void getEquipmentById_Success() throws Exception {
            Long id = 1L;
            EquipmentResponseDTO dto = new EquipmentResponseDTO();
            
            when(service.getEquipmentById(id)).thenReturn(dto);

            mockMvc.perform(get("/equipment/{id}", id))
                    .andExpect(status().isOk());

            verify(service).getEquipmentById(id);
        }
    }
}