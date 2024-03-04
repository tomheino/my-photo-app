// photo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from './model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'http://localhost:3000/photos';

  constructor(private http: HttpClient) {}

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  getRecentPhotos(): Observable<Photo[]> {
    // Make an HTTP GET request to fetch the recent photos data
    return this.http.get<Photo[]>(`${this.apiUrl}/latest`);
  }

  getPhotoById(id: string): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}`);
  }

  uploadPhoto(formData: FormData): Observable<any> {
    // Get the authentication token from local storage or wherever it's stored
    const token = localStorage.getItem('token');

    // Include the token in the request headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Make the HTTP request with the headers
    return this.http.post<any>(`${this.apiUrl}`, formData, { headers });
  }

  // Add other photo-related methods based on your backend API
}
