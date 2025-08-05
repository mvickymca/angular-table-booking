package com.example.jsonapi.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "json_documents")
public class JsonDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String filename;
    
    @Lob
    @Column(nullable = false)
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private String accessUrl;
    
    public JsonDocument() {
        this.createdAt = LocalDateTime.now();
    }
    
    public JsonDocument(String filename, String content, String accessUrl) {
        this();
        this.filename = filename;
        this.content = content;
        this.accessUrl = accessUrl;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFilename() {
        return filename;
    }
    
    public void setFilename(String filename) {
        this.filename = filename;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getAccessUrl() {
        return accessUrl;
    }
    
    public void setAccessUrl(String accessUrl) {
        this.accessUrl = accessUrl;
    }
}