# Table Booking API - Spring Boot Backend

A REST API backend for table booking system with mock responses, built with Spring Boot.

## Features

- **Table Management**: CRUD operations for restaurant tables
- **Booking Management**: Complete booking lifecycle management
- **Mock Data**: Pre-populated sample data for testing
- **API Documentation**: Swagger/OpenAPI documentation
- **CORS Support**: Configured for Angular frontend integration
- **Validation**: Input validation with proper error handling

## Tech Stack

- Java 11
- Spring Boot 2.7.18
- Maven
- Swagger/OpenAPI 3
- Jackson for JSON processing

## API Endpoints

### Tables
- `GET /api/tables` - Get all tables
- `GET /api/tables/{id}` - Get table by ID
- `GET /api/tables/available` - Get available tables
- `GET /api/tables/capacity/{minCapacity}` - Get tables by minimum capacity
- `GET /api/tables/location?location={location}` - Get tables by location
- `POST /api/tables` - Create new table
- `PUT /api/tables/{id}` - Update table
- `PATCH /api/tables/{id}/availability` - Toggle table availability
- `DELETE /api/tables/{id}` - Delete table

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/status/{status}` - Get bookings by status
- `GET /api/bookings/table/{tableId}` - Get bookings by table
- `GET /api/bookings/customer?email={email}` - Get bookings by customer email
- `GET /api/bookings/date-range?startDate={start}&endDate={end}` - Get bookings by date range
- `GET /api/bookings/today` - Get today's bookings
- `GET /api/bookings/statistics` - Get booking statistics
- `GET /api/bookings/availability` - Check table availability
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `PATCH /api/bookings/{id}/status?status={status}` - Update booking status
- `DELETE /api/bookings/{id}` - Delete booking

## Mock Data

The application comes with pre-populated mock data:

### Sample Tables
- Garden View Table (4 seats)
- Window Booth (2 seats)
- Chef's Table (6 seats)
- Private Dining (8 seats)
- Bar Counter (2 seats)
- Patio Table (4 seats)
- Round Table (6 seats)
- Corner Nook (3 seats)

### Sample Bookings
- Various bookings with different statuses (PENDING, CONFIRMED, CANCELLED)
- Sample customer data
- Different booking times and party sizes

## Getting Started

### Prerequisites
- Java 11 or higher
- Maven 3.6+

### Running the Application

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the API**
   - Base URL: `http://localhost:8080`
   - Swagger UI: `http://localhost:8080/swagger-ui/`
   - Health Check: `http://localhost:8080/actuator/health`

### Testing the API

You can test the API using:
- Swagger UI at `http://localhost:8080/swagger-ui/`
- Postman or any REST client
- cURL commands

Example cURL requests:

```bash
# Get all tables
curl -X GET http://localhost:8080/api/tables

# Get available tables
curl -X GET http://localhost:8080/api/tables/available

# Create a new booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": 1,
    "customerName": "John Doe",
    "customerEmail": "john.doe@email.com",
    "customerPhone": "+1-555-0123",
    "partySize": 4,
    "bookingDateTime": "2024-01-15T19:00:00",
    "durationHours": 2,
    "specialRequests": "Window seat preferred"
  }'

# Get booking statistics
curl -X GET http://localhost:8080/api/bookings/statistics
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/tablebooking/
│   │   │   ├── TableBookingApplication.java      # Main application class
│   │   │   ├── controller/                       # REST controllers
│   │   │   │   ├── TableController.java
│   │   │   │   └── BookingController.java
│   │   │   ├── model/                           # Domain models
│   │   │   │   ├── Table.java
│   │   │   │   └── Booking.java
│   │   │   └── service/                         # Business logic
│   │   │       ├── TableService.java
│   │   │       └── BookingService.java
│   │   └── resources/
│   │       └── application.yml                  # Configuration
│   └── test/                                    # Unit tests
├── pom.xml                                      # Maven configuration
└── README.md                                    # This file
```

## Configuration

The application can be configured via `application.yml`:

- **Server Port**: Default 8080
- **CORS**: Configured for localhost:4200 (Angular)
- **Logging**: Debug level for development
- **Jackson**: Date formatting and timezone settings

## Integration with Angular

The backend is configured to work seamlessly with the Angular frontend:

- CORS enabled for `http://localhost:4200`
- JSON responses formatted for easy consumption
- Error handling with proper HTTP status codes
- API endpoints designed for Angular HTTP client

## Development Notes

- All data is stored in-memory (resets on application restart)
- Mock data is initialized on application startup
- Swagger documentation available for API exploration
- Validation annotations ensure data integrity
- Proper HTTP status codes and error responses

## Future Enhancements

- Database integration (PostgreSQL/MySQL)
- Authentication and authorization
- Email notifications for bookings
- Payment integration
- Table availability calendar
- Booking confirmation system
- Admin dashboard endpoints