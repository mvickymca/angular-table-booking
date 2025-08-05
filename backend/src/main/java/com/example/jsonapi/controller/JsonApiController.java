package com.example.jsonapi.controller;

import com.example.jsonapi.model.JsonDocument;
import com.example.jsonapi.service.JsonDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class JsonApiController {
    
    @Autowired
    private JsonDocumentService jsonDocumentService;
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadJsonFile(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if file is JSON
            String filename = file.getOriginalFilename();
            if (filename == null || !filename.toLowerCase().endsWith(".json")) {
                response.put("success", false);
                response.put("message", "File must be a JSON file");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Read file content
            String content = new String(file.getBytes());
            
            // Validate JSON format (basic check)
            if (!isValidJson(content)) {
                response.put("success", false);
                response.put("message", "Invalid JSON format");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get base URL
            String baseUrl = getBaseUrl(request);
            
            // Save document
            JsonDocument savedDocument = jsonDocumentService.saveJsonDocument(filename, content, baseUrl);
            
            response.put("success", true);
            response.put("message", "File uploaded successfully");
            response.put("id", savedDocument.getId());
            response.put("filename", savedDocument.getFilename());
            response.put("accessUrl", savedDocument.getAccessUrl());
            response.put("createdAt", savedDocument.getCreatedAt());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Error reading file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/json/{id}")
    public ResponseEntity<Object> getJsonData(@PathVariable Long id) {
        String jsonContent = jsonDocumentService.getJsonContent(id);
        
        if (jsonContent == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "JSON document not found");
            errorResponse.put("id", id);
            return ResponseEntity.notFound().build();
        }
        
        // Return raw JSON content
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(jsonContent);
    }
    
    @GetMapping("/documents")
    public ResponseEntity<Map<String, Object>> getAllDocuments() {
        // This endpoint can be used to list all uploaded documents
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Use POST /api/upload to upload JSON files");
        response.put("usage", "After upload, access your JSON at the provided accessUrl");
        return ResponseEntity.ok(response);
    }
    
    private boolean isValidJson(String content) {
        try {
            content = content.trim();
            return (content.startsWith("{") && content.endsWith("}")) || 
                   (content.startsWith("[") && content.endsWith("]"));
        } catch (Exception e) {
            return false;
        }
    }
    
    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        String contextPath = request.getContextPath();
        
        StringBuilder url = new StringBuilder();
        url.append(scheme).append("://").append(serverName);
        
        if ((scheme.equals("http") && serverPort != 80) || 
            (scheme.equals("https") && serverPort != 443)) {
            url.append(":").append(serverPort);
        }
        
        url.append(contextPath);
        return url.toString();
    }
}