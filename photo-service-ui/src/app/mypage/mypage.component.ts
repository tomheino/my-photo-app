import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { User, Category } from '../model';
import { CategoryService } from '../category.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.css']
})
export class MypageComponent implements OnInit {
  userForm!: FormGroup;
  imageForm!: FormGroup;
  // categoriesFromModel: Category[] = [];
  categoryForm!: FormGroup;
  editMode = false;
  user!: User;

  selectedFile: File | null = null;
  photoName: string = '';
  description: string = '';
  username: string = ''; 
  apiUrlPhotos = 'http://localhost:3000/photos';
  apiUrlCategories = 'http://localhost:3000/categories';
  categories: any[] = []; // Array to store the selected categories
  selectedCategories: any[] = []; // Declare the selectedCategories property here


  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    
  ) {
    this.username = localStorage.getItem('username') || '';
    // console.log(this.username);
  }

  ngOnInit(): void {
    this.initForm();
    this.fetchUserInformation();
    this.fetchCategories(); 

      // Subscribe to changes in the selectedCategories form control
  this.imageForm.get('selectedCategories')?.valueChanges.subscribe(selectedCategories => {
    this.selectedCategories = selectedCategories;
  });
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      username: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }],
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }]
    });

    this.imageForm = this.formBuilder.group({
      name: [''],
      description: [''],
      selectedCategories: [[]] 
    });

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }


  addCategory(): void {
    if (this.categoryForm.valid) {
      // Get the category name from the form and ensure the first letter is uppercase
      let categoryName = this.categoryForm.get('name')?.value;
      categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  
      const categoryData = {
        name: categoryName,
        description: this.categoryForm.get('description')?.value
      };
  
      this.categoryService.addCategory(categoryData).subscribe(() => {
        console.log("Category added successfully!");
        this.showNotification(`Category ${categoryData.name} added successfully!`);
      }, error => {
        console.error("Error adding category:", error);
        this.showNotification(`Category ${categoryData.name} already exists!`);
        
      });
    } else {
      console.log("Invalid CategoryData!");
    }
  }
  
  


  fetchUserInformation(): void {
    this.userService.getUserById('1').subscribe(user => {
      this.user = user;
      this.populateForm();
    });
  }

  populateForm(): void {
    this.userForm.patchValue({
      username: this.user.username,
      password: this.user.password,
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  submitForm(): void {
    if (this.userForm.valid) {
      const updatedUserData = this.userForm.value;
      // Call the UserService to update user information
      this.userService.updateUserById('1', updatedUserData).subscribe(updatedUser => {
        // Handle successful update
        console.log('User information updated:', updatedUser);
        this.showNotification(`User information updated successfully!`);
        this.user = updatedUser;
        this.editMode = false;
      }, error => {
        // Handle error
        console.error('Error updating user information:', error);
        this.showNotification(`Error occurred while updating information!`);
      });
    } else {
      // Handle invalid form submission
    }
  }

  onFileSelected(event: any): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const file: File = event.target.files[0];
  
    // Check if the selected file is valid
    if (file && allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      console.log('Selected File:', this.selectedFile);
    } else {
      // Display an error message to the user
      console.error('Invalid file type. Please select a .jpg, .jpeg, .png, or .gif file.');
      this.showNotification(`Invalid file type. Please select a .jpg, .jpeg, .png, or .gif file.`);
      // You can use Angular Material Snackbar to display a message
    }
  }
  

uploadImage(): void {
  // Get the values from the form fields
  const name = this.imageForm.get('name')?.value;
  const description = this.imageForm.get('description')?.value;
  const username = this.username;

  // Check if all fields are filled
  if (!this.selectedFile || !name || !description || !username) {
    console.error('Please fill in all fields');
    this.showNotification(`Please fill in all fields!`);
    return;
  }

  // Retrieve the value of selectedCategories directly as an array of objects
  const categories = this.imageForm.get('selectedCategories')?.value;
  

  // Construct the FormData object
  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('username', username);
  formData.append('categories', JSON.stringify(categories));

  // Continue with the upload process
  this.http.post<any>(`${this.apiUrlPhotos}`, formData).subscribe({
    next: (response) => {
      console.log('Image uploaded successfully:', response);
      this.showNotification(`Photo added successfully!`);
      const imageUrl = response.url;
      console.log('Image URL:', imageUrl);
    },
    error: (error) => {
      console.error('Error uploading image:', error);
      this.showNotification(`Error occurred while uploading image!`);
    }
  });
}


fetchCategories(): void {
  this.http.get<any[]>(this.apiUrlCategories).subscribe(categories => {
    this.categories = categories;
    // console.log(categories);
  });
}

private showNotification(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000, // Duration in milliseconds
    horizontalPosition: 'center', // Positioning the notification
    verticalPosition: 'bottom' // Positioning the notification
  });
}
}
