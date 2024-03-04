import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  // Fetch all categories from the backend
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Add a new category
//   addCategory(category: Partial<Category>): Observable<Category> {
//     return this.http.post<Category>(this.apiUrl, category);
//   }

addCategory(categoryData: { name: string, description: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, categoryData);
  }
  
  // Update an existing category
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Category>(url, category);
  }

  // Delete a category by ID
  deleteCategory(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
