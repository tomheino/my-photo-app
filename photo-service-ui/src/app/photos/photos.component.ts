// photos.component.ts
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PhotoService } from '../photo.service';
import { Router } from '@angular/router';
import { slideInAnimation } from '../shared/animations';
import { Photo, Category } from '../model';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css'],
  animations: [slideInAnimation]

})
export class PhotosComponent implements OnInit, AfterViewInit {
  // @ViewChild('scrollButton') scrollButton!: ElementRef;
  photos: Photo[] = [];
  recentPhotos: Photo[] = [];
  paginatedPhotos: Photo[] = [];
  filteredPhotos: Photo[] = [];
  categories: Category[] = []; // Define categories property
  selectedCategories: string[] = [];
  pageSize = 10;
  pageSizeOptions= [5, 10, 25, 100];
  currentSlideIndex: number = 0;
  selectedImageIndex: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private photoService: PhotoService, private router: Router, private categoryService: CategoryService) {}
  
  // scrollToTop() {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }
  
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const scrollPos = document.documentElement.scrollTop || document.body.scrollTop || 0;
  //   const isVisible = scrollPos > 100; 
  //   this.scrollButton.nativeElement.style.display = isVisible ? 'block' : 'none';
  // }

  ngOnInit(): void {
    this.photoService.getRecentPhotos().subscribe((data: Photo[]) => {
      // Sort the data by photo ID in descending order to get the last added photos first
      this.recentPhotos = data.sort((a, b) => b.id - a.id).slice(0, 10); // Get the first 5 photos
    });
    this.loadPhotos();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  loadPhotos() {
    this.photoService.getPhotos().subscribe(
      (photos: Photo[]) => {
        // Sort the data by photo ID in descending order to get the last added photos first
        this.photos = photos.sort((a, b) => b.id - a.id);
        this.paginatePhotos();
      },
      (error) => {
        console.error('Error fetching photos:', error);
      }
    );
  }

  loadPreviousPage() {
    if (this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    }
  }

  loadNextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Photos per page';
  }

  loadRecentPhotos() {
    // Call your photo service to fetch the recent photos data
    this.photoService.getRecentPhotos().subscribe(
      (recentPhotos: Photo[]) => {
        this.recentPhotos = recentPhotos;
      },
      (error) => {
        console.error('Error fetching recent photos:', error);
      }
    );
  }


    onPageChange(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.paginatePhotos();
    }

    paginatePhotos() {
      // Filter photos based on selected categories
      if (this.selectedCategories.length > 0) {
        this.filteredPhotos = this.photos.filter(photo => {
          // Check if any of the photo's categories are included in the selected categories
          return photo.categories.some(category => 
            this.selectedCategories.includes(category.name)
          );
        });
      } else {
        this.filteredPhotos = this.photos;
      }
      
      // Perform pagination on filtered photos
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.paginatedPhotos = this.filteredPhotos.slice(startIndex, endIndex);
    }
      
    nextSlide() {
      const maxIndex = this.recentPhotos.length - 1;
      const imageWidths = document.querySelectorAll('.carousel-image').length; // Get the number of images
      const totalWidth = this.getTotalWidth(); // Get the total width of all images combined
      const scrollAmount = totalWidth / imageWidths; // Determine how much to scroll for each image
    
      if (this.currentSlideIndex < maxIndex) {
        this.currentSlideIndex += scrollAmount;
      } else {
        // If it's the last image, jump to the first image
        this.currentSlideIndex = 0;
      }
    }
  
  prevSlide() {
    const maxIndex = this.recentPhotos.length - 1;
    const imageWidths = document.querySelectorAll('.carousel-item').length;
    const totalWidth = this.getTotalWidth();
    const scrollAmount = totalWidth / imageWidths;
  
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex -= scrollAmount;
    } else {
      // If it's the first image, jump to the last image
      this.currentSlideIndex = maxIndex;
    }
  }
  
  getTotalWidth() {
    let totalWidth = 0;
    const images = document.querySelectorAll('.carousel-image');
    images.forEach(imageElement => {
      const image = imageElement as HTMLImageElement; // Cast the element to HTMLImageElement
      const imageHeight = 300; // Fixed height
      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      const width = (naturalWidth / naturalHeight) * imageHeight;
      totalWidth += width;
    });
    return totalWidth;
  }
  
  
  
  
  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  viewPhoto(photoId: number) {
    this.router.navigate(['/photo', photoId]);
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  getCarouselItemStyle(index: number) {
    if (index === this.selectedImageIndex) {
      return {
        transform: 'scale(1.2)' // Scale the selected image
      };
    }
    return {};
  }
}
