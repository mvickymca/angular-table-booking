import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private readonly apiUrl = 'http://localhost:8080/api/tables';

  constructor(private http: HttpClient) { }

  /**
   * Get all tables
   */
  getAllTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  /**
   * Get table by ID
   */
  getTableById(id: number): Observable<Table> {
    return this.http.get<Table>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all available tables
   */
  getAvailableTables(): Observable<Table[]> {
    return this.http.get<Table[]>(`${this.apiUrl}/available`);
  }

  /**
   * Get tables by minimum capacity
   */
  getTablesByCapacity(minCapacity: number): Observable<Table[]> {
    return this.http.get<Table[]>(`${this.apiUrl}/capacity/${minCapacity}`);
  }

  /**
   * Get tables by location
   */
  getTablesByLocation(location: string): Observable<Table[]> {
    const params = new HttpParams().set('location', location);
    return this.http.get<Table[]>(`${this.apiUrl}/location`, { params });
  }

  /**
   * Create a new table
   */
  createTable(table: Table): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table);
  }

  /**
   * Update an existing table
   */
  updateTable(id: number, table: Table): Observable<Table> {
    return this.http.put<Table>(`${this.apiUrl}/${id}`, table);
  }

  /**
   * Toggle table availability
   */
  toggleTableAvailability(id: number): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/${id}/availability`, {});
  }

  /**
   * Delete a table
   */
  deleteTable(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}