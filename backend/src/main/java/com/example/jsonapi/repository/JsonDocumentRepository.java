package com.example.jsonapi.repository;

import com.example.jsonapi.model.JsonDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JsonDocumentRepository extends JpaRepository<JsonDocument, Long> {
}