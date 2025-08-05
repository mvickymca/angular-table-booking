package com.example.tablebooking.controller;

import com.example.tablebooking.model.Table;
import com.example.tablebooking.service.TableService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tables")
@Api(tags = "Table Management", description = "Operations for managing restaurant tables")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class TableController {

    @Autowired
    private TableService tableService;

    @GetMapping
    @ApiOperation(value = "Get all tables", notes = "Retrieve a list of all tables in the restaurant")
    public ResponseEntity<List<Table>> getAllTables() {
        List<Table> tables = tableService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get table by ID", notes = "Retrieve a specific table by its ID")
    public ResponseEntity<Table> getTableById(
            @ApiParam(value = "Table ID", required = true) @PathVariable Long id) {
        Optional<Table> table = tableService.getTableById(id);
        return table.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    @ApiOperation(value = "Get available tables", notes = "Retrieve all currently available tables")
    public ResponseEntity<List<Table>> getAvailableTables() {
        List<Table> availableTables = tableService.getAvailableTables();
        return ResponseEntity.ok(availableTables);
    }

    @GetMapping("/capacity/{minCapacity}")
    @ApiOperation(value = "Get tables by minimum capacity", notes = "Retrieve tables that can accommodate at least the specified number of people")
    public ResponseEntity<List<Table>> getTablesByCapacity(
            @ApiParam(value = "Minimum capacity required", required = true) @PathVariable Integer minCapacity) {
        List<Table> tables = tableService.getTablesByCapacity(minCapacity);
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/location")
    @ApiOperation(value = "Get tables by location", notes = "Retrieve tables in a specific location")
    public ResponseEntity<List<Table>> getTablesByLocation(
            @ApiParam(value = "Location to search for", required = true) @RequestParam String location) {
        List<Table> tables = tableService.getTablesByLocation(location);
        return ResponseEntity.ok(tables);
    }

    @PostMapping
    @ApiOperation(value = "Create new table", notes = "Add a new table to the restaurant")
    public ResponseEntity<Table> createTable(
            @ApiParam(value = "Table information", required = true) @Valid @RequestBody Table table) {
        Table createdTable = tableService.createTable(table);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTable);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Update table", notes = "Update an existing table's information")
    public ResponseEntity<Table> updateTable(
            @ApiParam(value = "Table ID", required = true) @PathVariable Long id,
            @ApiParam(value = "Updated table information", required = true) @Valid @RequestBody Table table) {
        Optional<Table> updatedTable = tableService.updateTable(id, table);
        return updatedTable.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/availability")
    @ApiOperation(value = "Toggle table availability", notes = "Toggle the availability status of a table")
    public ResponseEntity<String> toggleTableAvailability(
            @ApiParam(value = "Table ID", required = true) @PathVariable Long id) {
        boolean success = tableService.toggleTableAvailability(id);
        if (success) {
            return ResponseEntity.ok("Table availability toggled successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete table", notes = "Remove a table from the restaurant")
    public ResponseEntity<String> deleteTable(
            @ApiParam(value = "Table ID", required = true) @PathVariable Long id) {
        boolean deleted = tableService.deleteTable(id);
        if (deleted) {
            return ResponseEntity.ok("Table deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}