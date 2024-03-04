import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../model';
import { PhotoService } from '../photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit, OnDestroy {
  photo: Photo | undefined;
  photos: Photo[] = [];
  currentPhotoIndex: number = 0;
  private routeSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private photoService: PhotoService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('Photo ID is null');
      // Handle the error gracefully, e.g., redirect to a 404 page
      return;
    }

    // Fetch the current photo by ID
    const photoByIdSubscription = this.photoService.getPhotoById(id).subscribe(photo => {
      this.photo = photo;
    }, error => {
      console.error('Error fetching photo by ID:', error);
      // Handle the error gracefully, e.g., redirect to a 404 page
    });

    // Fetch all photos and populate the photos array
    const photosSubscription = this.photoService.getPhotos().subscribe(photos => {
      this.photos = photos;

      // Find the index of the current photo
      const index = this.photos.findIndex(photo => photo.id === parseInt(id!));
      if (index !== -1) {
        this.currentPhotoIndex = index;
      }
    }, error => {
      console.error('Error fetching photos:', error);
      // Handle the error gracefully
    });

    // Add subscriptions to the routeSubscription for cleanup
    this.routeSubscription.add(photoByIdSubscription);
    this.routeSubscription.add(photosSubscription);
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions onDestroy
    this.routeSubscription.unsubscribe();
  }

  get currentPhoto(): Photo | undefined {
    return this.photos[this.currentPhotoIndex];
  }
  
  previousPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    } else {
      // If the current photo is the first one, loop to the last one
      this.currentPhotoIndex = this.photos.length - 1;
    }
    console.log('Previous Photo:', this.currentPhoto);
  }
  
  nextPhoto() {
    if (this.currentPhotoIndex < this.photos.length - 1) {
      this.currentPhotoIndex++;
    } else {
      // If the current photo is the last one, loop to the first one
      this.currentPhotoIndex = 0;
    }
    console.log('Next Photo:', this.currentPhoto);
  }
}
