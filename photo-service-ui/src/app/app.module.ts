// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './login/auth.interceptor';
import { ToolbarComponent } from './toolbar/toolbar.component';
// import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PhotosComponent } from './photos/photos.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatSidenavContent } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MypageComponent } from './mypage/mypage.component';
// import { MatCarouselModule } from '@angular/material/carousel';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { PhotoComponent } from './photo/photo.component';
// import { PhotoComponent } from './photo/photo.component';
import { MatSelectModule } from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import { JwtModule } from '@auth0/angular-jwt';







// import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    // HomeComponent,
    LoginComponent,
    PhotosComponent,
    MypageComponent,
    FooterComponent,
    PhotoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatSidenavContainer,
    MatSidenavContent,
    FormsModule, 
    MatGridListModule,
    MatExpansionModule,
    MatCardModule,
    BrowserAnimationsModule,
    RouterModule,
    MatSnackBarModule,
    MatListModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatPaginatorModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('accessToken'),
        // allowedDomains: ['example.com'], 
        // disallowedRoutes: ['example.com/example/route'] 
      }
    })
    // MatCarouselModule.forRoot()

    
    // FlexLayoutModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
