//package booking_service;
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//public class BookingServiceApplicationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private BookingRepository repo;
//
//    @MockBean
//    private PricingClient pricingClient;
//
//    @BeforeEach
//    void setup() {
//        repo.deleteAll();
//
//        when(pricingClient.calculatePrice(anyDouble(), anyString(), anyString()))
//                .thenReturn(5000.0);
//    }
//
//    @Test
//    void testCreateBooking() throws Exception {
//
//        String requestBody = """
//        {
//            "userId": 101,
//            "equipmentId": 500,
//            "startDate": "2026-06-15",
//            "endDate": "2026-06-18"
//        }
//        """;
//
//        mockMvc.perform(post("/booking/add")
//                .contentType("application/json")
//                .content(requestBody))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.status").value("BOOKED"));
//    }
//}