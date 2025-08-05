package com.example.jsonapi.service;

import com.example.jsonapi.model.JsonDocument;
import com.example.jsonapi.repository.JsonDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class JsonDocumentService {
    
    @Autowired
    private JsonDocumentRepository repository;
    
    public JsonDocument saveJsonDocument(String filename, String content, String baseUrl) {
        // Generate access URL with ID placeholder
        String accessUrl = baseUrl + "/api/json/";
        
        JsonDocument document = new JsonDocument(filename, content, accessUrl);
        JsonDocument savedDocument = repository.save(document);
        
        // Update access URL with actual ID
        savedDocument.setAccessUrl(accessUrl + savedDocument.getId());
        return repository.save(savedDocument);
    }
    
    public Optional<JsonDocument> getJsonDocument(Long id) {
        return repository.findById(id);
    }
    
    public String getJsonContent(Long id) {
        Optional<JsonDocument> document = repository.findById(id);
        return document.map(JsonDocument::getContent).orElse(null);
    }
}