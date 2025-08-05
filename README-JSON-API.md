# Spring Boot/Angular JSON API Application

This application allows you to upload custom JSON files and provides consumable API URLs to access the uploaded JSON data.

## Features

- **JSON File Upload**: Upload JSON files through a modern, drag-and-drop interface
- **API URL Generation**: Automatically generates unique URLs for each uploaded JSON file
- **RESTful API**: Access your JSON data via clean REST endpoints
- **Data Persistence**: JSON files are stored in an H2 database
- **Modern UI**: Beautiful, responsive Angular frontend with file validation

## Architecture

- **Backend**: Spring Boot 2.7.18 with REST API
- **Frontend**: Angular 5.x with modern UI components
- **Database**: H2 in-memory database
- **File Storage**: JSON content stored as text in database

## Getting Started

### Prerequisites

- Java 11 or higher
- Node.js 8.x or higher
- NPM 5.x or higher
- Maven 3.6 or higher

### Running the Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and start the server:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

3. (Optional) Access H2 Console for database inspection:
   - URL: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave blank)

### Running the Frontend (Angular)

1. Navigate to the project root directory:
   ```bash
   cd /workspace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:4200`

## API Endpoints

### Upload JSON File
```
POST /api/upload
Content-Type: multipart/form-data
```

**Parameters:**
- `file`: JSON file to upload

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "id": 1,
  "filename": "example.json",
  "accessUrl": "http://localhost:8080/api/json/1",
  "createdAt": "2024-01-15T10:30:00"
}
```

### Get JSON Data
```
GET /api/json/{id}
```

**Response:** Raw JSON content with `application/json` content type

### Get API Information
```
GET /api/documents
```

**Response:** API usage information

## Usage

1. **Start both servers** (backend on :8080, frontend on :4200)

2. **Open the application** in your browser: `http://localhost:4200`

3. **Upload a JSON file**:
   - Drag and drop a JSON file onto the upload area, or
   - Click "Choose File" to browse and select a JSON file

4. **Get your API URL**: After successful upload, you'll receive:
   - A unique API URL to access your JSON data
   - File details (ID, filename, creation time)
   - Options to copy the URL or view the JSON directly

5. **Access your JSON**: Use the provided URL to access your JSON data programmatically:
   ```bash
   curl http://localhost:8080/api/json/1
   ```

## File Requirements

- **File Type**: Must be a valid JSON file (`.json` extension)
- **File Size**: Maximum 10MB per file
- **Content**: Must contain valid JSON syntax (objects `{}` or arrays `[]`)

## Example Usage

### Upload a JSON file:
```json
{
  "users": [
    {"id": 1, "name": "John Doe", "email": "john@example.com"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
  ],
  "metadata": {
    "version": "1.0",
    "created": "2024-01-15"
  }
}
```

### Access the uploaded data:
```bash
# Get the JSON data
curl http://localhost:8080/api/json/1

# Use in your application
fetch('http://localhost:8080/api/json/1')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Change server port
server.port=8080

# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb

# File upload limits
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Frontend Configuration
Edit `src/app/json-upload.service.ts`:

```typescript
// Change backend URL
private baseUrl = 'http://localhost:8080/api';
```

## CORS Configuration

The backend is configured to accept requests from `http://localhost:4200`. To allow other origins, update the `@CrossOrigin` annotation in `JsonApiController.java`.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running and CORS is properly configured
2. **File Upload Fails**: Check file size limits and ensure file is valid JSON
3. **Connection Refused**: Verify both servers are running on correct ports
4. **Invalid JSON Error**: Validate your JSON syntax before uploading

### Logs

- **Backend logs**: Check console output where Spring Boot is running
- **Frontend logs**: Check browser developer console (F12)
- **Database**: Use H2 console to inspect stored data

## Development

### Adding New Features

1. **Backend**: Add new REST endpoints in `JsonApiController.java`
2. **Frontend**: Create new Angular components and services
3. **Database**: Modify `JsonDocument` entity for new fields

### Testing

```bash
# Backend tests
cd backend
mvn test

# Frontend tests  
npm test
```

## Security Notes

- This is a development application with H2 in-memory database
- For production use, configure proper database and security measures
- Implement authentication and authorization as needed
- Validate and sanitize all JSON input in production

## License

MIT License - feel free to use and modify as needed.