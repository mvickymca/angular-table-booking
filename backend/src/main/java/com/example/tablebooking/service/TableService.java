package com.example.tablebooking.service;

import com.example.tablebooking.model.Table;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class TableService {
    
    private final Map<Long, Table> tables = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @PostConstruct
    public void initializeMockData() {
        // Create mock tables
        createTable(new Table(null, "Garden View Table", 4, "Garden Terrace", 
                "Beautiful table overlooking the garden with natural lighting", 25.0));
        createTable(new Table(null, "Window Booth", 2, "Main Dining", 
                "Cozy booth by the window, perfect for intimate dining", 20.0));
        createTable(new Table(null, "Chef's Table", 6, "Kitchen View", 
                "Premium seating with view of the open kitchen", 40.0));
        createTable(new Table(null, "Private Dining", 8, "Private Room", 
                "Separate room for private events and celebrations", 60.0));
        createTable(new Table(null, "Bar Counter", 2, "Bar Area", 
                "High-top seating at the bar counter", 15.0));
        createTable(new Table(null, "Patio Table", 4, "Outdoor Patio", 
                "Al fresco dining on the covered patio", 30.0));
        createTable(new Table(null, "Round Table", 6, "Main Dining", 
                "Classic round table perfect for family dining", 35.0));
        createTable(new Table(null, "Corner Nook", 3, "Main Dining", 
                "Quiet corner spot with comfortable seating", 22.0));
    }

    public List<Table> getAllTables() {
        return new ArrayList<>(tables.values());
    }

    public Optional<Table> getTableById(Long id) {
        return Optional.ofNullable(tables.get(id));
    }

    public List<Table> getAvailableTables() {
        return tables.values().stream()
                .filter(Table::getIsAvailable)
                .collect(Collectors.toList());
    }

    public List<Table> getTablesByCapacity(Integer minCapacity) {
        return tables.values().stream()
                .filter(table -> table.getCapacity() >= minCapacity)
                .collect(Collectors.toList());
    }

    public List<Table> getTablesByLocation(String location) {
        return tables.values().stream()
                .filter(table -> table.getLocation().toLowerCase().contains(location.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Table createTable(Table table) {
        table.setId(idGenerator.getAndIncrement());
        table.setCreatedAt(LocalDateTime.now());
        table.setUpdatedAt(LocalDateTime.now());
        tables.put(table.getId(), table);
        return table;
    }

    public Optional<Table> updateTable(Long id, Table updatedTable) {
        Table existingTable = tables.get(id);
        if (existingTable != null) {
            updatedTable.setId(id);
            updatedTable.setCreatedAt(existingTable.getCreatedAt());
            updatedTable.setUpdatedAt(LocalDateTime.now());
            tables.put(id, updatedTable);
            return Optional.of(updatedTable);
        }
        return Optional.empty();
    }

    public boolean deleteTable(Long id) {
        return tables.remove(id) != null;
    }

    public boolean toggleTableAvailability(Long id) {
        Table table = tables.get(id);
        if (table != null) {
            table.setIsAvailable(!table.getIsAvailable());
            table.setUpdatedAt(LocalDateTime.now());
            return true;
        }
        return false;
    }
}