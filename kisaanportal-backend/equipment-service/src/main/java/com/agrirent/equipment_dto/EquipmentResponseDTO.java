package com.agrirent.equipment_dto;

import com.agrirent.equipment_service.entity.Equipment;

public class EquipmentResponseDTO {

    private Equipment equipment;

    private UserDTO owner;

    public EquipmentResponseDTO() {
    }

    public EquipmentResponseDTO(
            Equipment equipment,
            UserDTO owner) {

        this.equipment = equipment;
        this.owner = owner;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }
}