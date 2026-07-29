package booking_service.client;

import java.util.Map;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "pricing-service", url = "http://localhost:3005")
public interface PricingClient {

    @GetMapping("/pricing/bill")
    Map<String, Object> calculateBill(
            @RequestParam("pricePerDay") double pricePerDay,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate
    );
}