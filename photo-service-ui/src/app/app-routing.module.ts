// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

// app-routing.module.ts

// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MypageComponent } from './mypage/mypage.component';
import { PhotoComponent } from './photo/photo.component';
import { PhotosComponent } from './photos/photos.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'photos', component: PhotosComponent, data: { animation: 'PhotosPage' } },
  { path: 'photo/:id', component: PhotoComponent , data: { animation: 'PhotoPage' } },
  { path: 'mypage', component: MypageComponent, canActivate: [AuthGuard], data: { animation: 'MyPage' } },
  { path: '', redirectTo: '/photos', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

