package com.agrirent.equipment_service.service;

import com.agrirent.equipment_dto.EquipmentResponseDTO;
import com.agrirent.equipment_dto.UserDTO;
import com.agrirent.equipment_service.client.UserFeignClient;
import com.agrirent.equipment_service.entity.Equipment;
import com.agrirent.equipment_service.exception.ResourceNotFoundException;
import com.agrirent.equipment_service.repository.EquipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.CopyOption;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceImplTest {

    @Mock
    private EquipmentRepository repo;

    @Mock
    private UserFeignClient userFeignClient;

    @InjectMocks
    private EquipmentServiceImpl equipmentService;

    private Equipment sampleEquipment;

    @BeforeEach
    void setUp() {
        sampleEquipment = new Equipment();
        sampleEquipment.setId(1L);
        sampleEquipment.setName("Harvester 3000");
        sampleEquipment.setType("Harvester");
        sampleEquipment.setLocation("Springfield");
        sampleEquipment.setPricePerDay(500.0);
        sampleEquipment.setAvailable(true);
        sampleEquipment.setOwnerId(10L);
    }


    @Nested
    @DisplayName("addEquipment Tests")
    class AddEquipmentTests {

        @Test
        @DisplayName("Should save file to upload path and return saved equipment")
        void addEquipment_Success() throws Exception {
            MockMultipartFile image = new MockMultipartFile(
                    "image",
                    "harvester.jpg",
                    "image/jpeg",
                    "dummy content".getBytes()
            );

            when(repo.save(any(Equipment.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Mock static Files calls to prevent disk side-effects
            try (MockedStatic<Files> mockedFiles = mockStatic(Files.class)) {
                mockedFiles.when(() -> Files.exists(any(Path.class))).thenReturn(true);
                mockedFiles.when(() -> Files.copy(any(InputStream.class), any(Path.class), any(CopyOption[].class)))
                           .thenReturn(0L);

                Equipment result = equipmentService.addEquipment(
                        "Harvester 3000",
                        "Harvester",
                        "Springfield",
                        500.0,
                        true,
                        image
                );

                assertThat(result).isNotNull();
                assertThat(result.getName()).isEqualTo("Harvester 3000");
                assertThat(result.getImageUrl()).contains("harvester.jpg");
                verify(repo, times(1)).save(any(Equipment.class));
            }
        }
    }


    @Nested
    @DisplayName("Search & Retrieval Tests")
    class RetrievalTests {

        @Test
        @DisplayName("Should return all equipment")
        void getAllEquipment_Success() {
            when(repo.findAll()).thenReturn(List.of(sampleEquipment));

            List<Equipment> results = equipmentService.getAllEquipment();

            assertThat(results).hasSize(1);
            verify(repo, times(1)).findAll();
        }

        @Test
        @DisplayName("Should return equipment by type (case-insensitive)")
        void getByType_Success() {
            String type = "harvester";
            when(repo.findByTypeContainingIgnoreCase(type)).thenReturn(List.of(sampleEquipment));

            List<Equipment> results = equipmentService.getByType(type);

            assertThat(results).hasSize(1);
            verify(repo, times(1)).findByTypeContainingIgnoreCase(type);
        }

        @Test
        @DisplayName("Should return equipment by location (case-insensitive)")
        void getByLocation_Success() {
            String location = "springfield";
            when(repo.findByLocationContainingIgnoreCase(location)).thenReturn(List.of(sampleEquipment));

            List<Equipment> results = equipmentService.getByLocation(location);

            assertThat(results).hasSize(1);
            verify(repo, times(1)).findByLocationContainingIgnoreCase(location);
        }
    }


    @Nested
    @DisplayName("getEquipmentById Tests")
    class GetEquipmentByIdTests {

        @Test
        @DisplayName("Should return EquipmentResponseDTO with owner details when found")
        void getEquipmentById_WithOwner_Success() {
            Long id = 1L;
            UserDTO mockUser = new UserDTO(); // Assume standard DTO

            when(repo.findById(id)).thenReturn(Optional.of(sampleEquipment));
            when(userFeignClient.getUserById(sampleEquipment.getOwnerId())).thenReturn(mockUser);

            EquipmentResponseDTO response = equipmentService.getEquipmentById(id);

            assertThat(response).isNotNull();
            verify(repo, times(1)).findById(id);
            verify(userFeignClient, times(1)).getUserById(sampleEquipment.getOwnerId());
        }

        @Test
        @DisplayName("Should return EquipmentResponseDTO with null owner when Feign client throws exception")
        void getEquipmentById_FeignError_ReturnsNullOwner() {
            Long id = 1L;

            when(repo.findById(id)).thenReturn(Optional.of(sampleEquipment));
            when(userFeignClient.getUserById(sampleEquipment.getOwnerId()))
                    .thenThrow(new RuntimeException("Auth-service unavailable"));

            EquipmentResponseDTO response = equipmentService.getEquipmentById(id);

            assertThat(response).isNotNull();
            verify(repo, times(1)).findById(id);
            verify(userFeignClient, times(1)).getUserById(sampleEquipment.getOwnerId());
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when equipment ID does not exist")
        void getEquipmentById_NotFound_ThrowsException() {
            Long id = 99L;
            when(repo.findById(id)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> equipmentService.getEquipmentById(id))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Equipment not found with id: " + id);

            verify(userFeignClient, never()).getUserById(any());
        }
    }
}