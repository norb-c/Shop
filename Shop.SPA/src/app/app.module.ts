import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes.routing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';
import { AdminNavComponent } from './admin/admin-nav/admin-nav.component';
import { CategoryComponent } from './admin/category/category.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserNavComponent } from './user/user-nav/user-nav.component';
import { UserPanelComponent } from './user/user-panel/user-panel.component';
import { HomeComponent } from './user/home/home.component';
import { ViewProductsComponent } from './admin/products/view-products/view-products.component';
import { ProductListComponent } from './admin/products/product-list/product-list.component';
import { ProductViewResolver } from './_resolver/product-view.resolver';
import { ProductPhotosComponent } from './admin/products/product-photos/product-photos.component';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ProductDetailComponent } from './admin/products/product-detail/product-detail.component';
import { CreateProductComponent } from './admin/products/create-product/create-product.component';
import { EditProductComponent } from './admin/products/edit-product/edit-product.component';
import { AdminGuard } from './_guards/admin.guard';
import { HasRoleDirective } from './_directives/has-role.directive';
import { ArchivesComponent } from './admin/products/archives/archives.component';
import { FooterComponent } from './user/footer/footer.component';
import { CarouselComponent } from './user/carousel/carousel.component';
import { MoneyPipe } from './_utils/money.pipe';
import { CartComponent } from './user/cart/cart.component';
import { UIService } from './_services/global/ui.service';
import { RegisterComponent } from './user/register/register.component';
import { MatDialogRef } from '@angular/material';
import { CartDialogComponent } from './user/dialogs/cart-dialog/cart-dialog.component';
import { ItemDetailComponent } from './user/item-detail/item-detail.component';
import { ShippingAddressDialogComponent } from './user/dialogs/shipping-address-dialog/shipping-address-dialog.component';
import { LoginDialogComponent } from './user/dialogs/login-dialog/login-dialog.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    AdminPanelComponent,
    AdminNavComponent,
    ViewProductsComponent,
    ProductListComponent,
    ProductPhotosComponent,
    ProductDetailComponent,
    ArchivesComponent,
    EditProductComponent,
    CreateProductComponent,
    CategoryComponent,
    HomeComponent,
    CarouselComponent,
    UserNavComponent,
    UserPanelComponent,
    CartDialogComponent,
    ItemDetailComponent,
    CartComponent,
    RegisterComponent,
    FooterComponent,
    LoginDialogComponent,
    ShippingAddressDialogComponent,
    HasRoleDirective,
    MoneyPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGalleryModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    FileUploadModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/auth/']
      }
    })
  ],
  entryComponents: [CartDialogComponent, LoginDialogComponent, ShippingAddressDialogComponent],
  providers: [
    UIService,
    ProductViewResolver,
    AdminGuard,
    CartDialogComponent,
    LoginDialogComponent,
    ShippingAddressDialogComponent,
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
