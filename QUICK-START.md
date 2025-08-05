# Quick Start Guide - JSON API Application

## What You Have

A complete **Spring Boot + Angular** application that:
- ✅ Accepts custom JSON file uploads
- ✅ Stores JSON data in H2 database
- ✅ Generates unique API URLs for each uploaded JSON
- ✅ Provides RESTful endpoints to consume the JSON data
- ✅ Includes both Angular frontend and standalone HTML test interface

## Immediate Testing (Recommended)

### Option 1: Use the Standalone HTML Test Interface

1. **Start the backend** (if you have Java and Maven installed):
   ```bash
   ./start-backend.sh
   ```

2. **Open the test interface** in your browser:
   ```bash
   open test-upload.html
   # or simply double-click the file
   ```

3. **Test with the example file**:
   - Upload the provided `example-data.json` file
   - Get your unique API URL
   - Access your JSON data via the generated URL

### Option 2: Test with curl (Command Line)

```bash
# 1. Start backend (requires Java + Maven)
./start-backend.sh

# 2. Upload a JSON file
curl -X POST http://localhost:8080/api/upload \
  -F "file=@example-data.json"

# 3. Access the uploaded JSON (replace {id} with returned ID)
curl http://localhost:8080/api/json/1
```

## Full Setup (Both Frontend and Backend)

### Prerequisites
- Java 11+ (for Spring Boot backend)
- Node.js 8+ (for Angular frontend)
- Maven (will be auto-installed by startup script)

### Start Backend
```bash
# Make script executable and run
chmod +x start-backend.sh
./start-backend.sh
```
Backend will run on: `http://localhost:8080`

### Start Angular Frontend
```bash
# Install dependencies (may need compatibility fixes for newer Node.js)
npm install

# Start development server
npm start
```
Frontend will run on: `http://localhost:4200`

## How It Works

1. **Upload JSON**: Use either the Angular UI or HTML test interface to upload a `.json` file
2. **Get API URL**: Receive a unique URL like `http://localhost:8080/api/json/1`
3. **Consume Data**: Use the URL in your applications to fetch the JSON data

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload JSON file |
| GET | `/api/json/{id}` | Get JSON data by ID |
| GET | `/api/documents` | Get API information |
| GET | `/h2-console` | Database console (dev only) |

## Files Included

### Backend (Spring Boot)
- `backend/` - Complete Spring Boot application
- `backend/pom.xml` - Maven dependencies
- `backend/src/main/java/com/example/jsonapi/` - Java source code
  - `JsonApiApplication.java` - Main application class
  - `controller/JsonApiController.java` - REST endpoints
  - `service/JsonDocumentService.java` - Business logic
  - `model/JsonDocument.java` - JPA entity
  - `repository/JsonDocumentRepository.java` - Data access

### Frontend (Angular)
- `src/app/json-upload/` - File upload component
- `src/app/json-upload.service.ts` - HTTP service
- Updated `app.module.ts` and `app.component.html`

### Testing & Documentation
- `test-upload.html` - Standalone test interface
- `example-data.json` - Sample JSON file for testing
- `README-JSON-API.md` - Complete documentation
- `start-backend.sh` - Backend startup script

## Example Usage

Upload this JSON and get a consumable API:

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

Access via: `http://localhost:8080/api/json/1`

## Troubleshooting

1. **Backend won't start**: Ensure Java 11+ is installed
2. **Maven not found**: The startup script will install it automatically
3. **Angular issues**: Use the standalone HTML test interface instead
4. **CORS errors**: Backend is configured for `localhost:4200`
5. **File upload fails**: Ensure file has `.json` extension and valid JSON syntax

## Next Steps

- Customize the Angular UI components
- Add authentication/authorization
- Switch to persistent database (PostgreSQL/MySQL)
- Deploy to cloud platforms
- Add file size limits and validation
- Implement user management

Your JSON API application is ready to use! 🚀