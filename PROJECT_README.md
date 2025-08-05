# Table Booking System - Full Stack Application

A complete table booking system with Spring Boot REST API backend providing mock responses and Angular frontend for interaction.

## Project Structure

```
table-booking-system/
├── backend/                           # Spring Boot API
│   ├── src/main/java/com/example/tablebooking/
│   │   ├── TableBookingApplication.java
│   │   ├── controller/
│   │   │   ├── TableController.java
│   │   │   └── BookingController.java
│   │   ├── model/
│   │   │   ├── Table.java
│   │   │   └── Booking.java
│   │   └── service/
│   │       ├── TableService.java
│   │       └── BookingService.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── README.md
├── src/app/                          # Angular Frontend
│   ├── components/
│   │   └── dashboard/                # New API-integrated dashboard
│   ├── models/                       # TypeScript models
│   │   ├── table.model.ts
│   │   └── booking.model.ts
│   ├── services/                     # API services
│   │   ├── table.service.ts
│   │   └── booking.service.ts
│   ├── tab-book-main/               # Legacy component
│   └── [existing Angular structure...]
├── package.json
└── PROJECT_README.md                 # This file
```

## Features

### Backend (Spring Boot API)
- **REST API Endpoints**: Complete CRUD operations for tables and bookings
- **Mock Data**: Pre-populated sample data for testing and demonstration
- **CORS Support**: Configured for Angular frontend integration
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Input validation with proper error handling
- **Statistics**: Booking analytics and metrics

### Frontend (Angular)
- **Modern Dashboard**: Complete UI for managing tables and bookings
- **API Integration**: Real-time data from Spring Boot backend
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Reactive forms with validation
- **Filtering & Search**: Filter tables and bookings by various criteria
- **Legacy Support**: Maintains existing components for backward compatibility

## API Endpoints

### Tables API (`/api/tables`)
- `GET /api/tables` - Get all tables
- `GET /api/tables/{id}` - Get table by ID
- `GET /api/tables/available` - Get available tables
- `GET /api/tables/capacity/{minCapacity}` - Filter by capacity
- `GET /api/tables/location?location={location}` - Filter by location
- `POST /api/tables` - Create new table
- `PUT /api/tables/{id}` - Update table
- `PATCH /api/tables/{id}/availability` - Toggle availability
- `DELETE /api/tables/{id}` - Delete table

### Bookings API (`/api/bookings`)
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/status/{status}` - Filter by status
- `GET /api/bookings/table/{tableId}` - Get bookings for table
- `GET /api/bookings/customer?email={email}` - Filter by customer
- `GET /api/bookings/today` - Get today's bookings
- `GET /api/bookings/statistics` - Get booking statistics
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `PATCH /api/bookings/{id}/status?status={status}` - Update status
- `DELETE /api/bookings/{id}` - Delete booking

## Getting Started

### Prerequisites
- **Java 11+** for Spring Boot backend
- **Maven 3.6+** for dependency management
- **Node.js 12+** for Angular frontend
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Verify backend is running**
   - API Base URL: `http://localhost:8080`
   - Swagger UI: `http://localhost:8080/swagger-ui/`
   - Health Check: `http://localhost:8080/actuator/health`

### Frontend Setup

1. **Navigate to project root (where package.json is located)**
   ```bash
   cd ../
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Angular development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Access the application**
   - Frontend URL: `http://localhost:4200`
   - Dashboard: `http://localhost:4200/dashboard`
   - Legacy View: `http://localhost:4200/legacy`

## Usage Guide

### Dashboard Features

#### 1. Tables Management
- **View Tables**: Browse all restaurant tables with details
- **Filter Tables**: Filter by capacity and location
- **Add Tables**: Create new tables with full details
- **Toggle Availability**: Mark tables as available/unavailable
- **Real-time Updates**: All data synced with backend API

#### 2. Bookings Management
- **View Bookings**: See all reservations with status indicators
- **Filter Bookings**: Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- **Create Bookings**: Make new reservations with validation
- **Update Status**: Confirm, complete, or cancel bookings
- **Customer Search**: Find bookings by customer email
- **Today's View**: Quick access to today's bookings

#### 3. Statistics Dashboard
- **Total Bookings**: Overall booking count
- **Status Breakdown**: Confirmed, pending, cancelled counts
- **Today's Bookings**: Current day statistics
- **Confirmation Rate**: Success rate percentage
- **Visual Indicators**: Color-coded statistics cards

### Sample Data

The backend initializes with sample data including:

#### Tables
- Garden View Table (4 people, $25/hour)
- Window Booth (2 people, $20/hour)
- Chef's Table (6 people, $40/hour)
- Private Dining (8 people, $60/hour)
- Bar Counter (2 people, $15/hour)
- Patio Table (4 people, $30/hour)
- Round Table (6 people, $35/hour)
- Corner Nook (3 people, $22/hour)

#### Bookings
- Various bookings with different statuses
- Sample customer data
- Different booking times and party sizes

## API Testing

### Using Swagger UI
1. Start the backend server
2. Navigate to `http://localhost:8080/swagger-ui/`
3. Explore and test all API endpoints interactively

### Using cURL

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

## Development Notes

### Backend
- **In-Memory Storage**: Data resets on application restart
- **Mock Data**: Automatically populated on startup
- **CORS Configuration**: Enabled for `localhost:4200`
- **Validation**: Bean validation with proper error responses
- **Logging**: Debug level logging for development

### Frontend
- **Service Layer**: Complete TypeScript services for API interaction
- **Reactive Forms**: Form validation and error handling
- **Error Handling**: Graceful error messages and retry options
- **Responsive Design**: Mobile-first CSS approach
- **Legacy Compatibility**: Original components preserved

## Technology Stack

### Backend
- **Java 11**
- **Spring Boot 2.7.18**
- **Spring Web** (REST API)
- **Spring Validation** (Bean validation)
- **Maven** (Build tool)
- **Swagger/OpenAPI 3** (API documentation)

### Frontend
- **Angular 5** (TypeScript framework)
- **RxJS** (Reactive programming)
- **Angular HTTP Client** (API communication)
- **Angular Reactive Forms** (Form handling)
- **CSS3** (Modern styling)

## Future Enhancements

### Backend
- Database integration (PostgreSQL/MySQL)
- Authentication and authorization (JWT)
- Email notifications for bookings
- Payment integration
- Real-time availability checking
- Booking confirmation system
- Admin role management

### Frontend
- Advanced filtering and sorting
- Calendar view for bookings
- Drag-and-drop table management
- Real-time notifications
- Customer portal
- Reporting and analytics
- Mobile app (Ionic/React Native)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8080
   - Check CORS configuration in `TableBookingApplication.java`

2. **Port Conflicts**
   - Backend: Change port in `application.yml`
   - Frontend: Use `ng serve --port 4201`

3. **API Connection Issues**
   - Verify backend is running: `http://localhost:8080/actuator/health`
   - Check Angular service URLs point to correct backend port

4. **Form Validation Errors**
   - Check TypeScript models match backend models
   - Verify required fields are properly marked

### Logs and Debugging
- **Backend Logs**: Console output when running `mvn spring-boot:run`
- **Frontend Logs**: Browser developer console (F12)
- **Network Issues**: Check browser Network tab for API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes to backend or frontend
4. Test both components together
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is a demonstration project with mock data. For production use, implement proper database integration, authentication, and security measures.