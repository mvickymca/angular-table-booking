import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class JsonUploadService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: Http) { }

  uploadJsonFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload`, formData)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getJsonData(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/json/${id}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return Observable.throw(error.json?.() || 'Server error');
  }
}