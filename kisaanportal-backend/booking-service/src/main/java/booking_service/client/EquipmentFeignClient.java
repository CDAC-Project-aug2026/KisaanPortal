package booking_service.client;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "equipment-service", url = "http://localhost:3003")
public interface EquipmentFeignClient {

    @GetMapping("/equipment/{id}")
    Map<String, Object> getEquipmentById(@PathVariable("id") Long id);
}
