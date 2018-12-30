import { Component, OnInit, ViewChild } from '@angular/core';
import { Products } from 'src/app/_models/Products';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { AlertifyService } from 'src/app/_services/gloabal/alertify.service';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isUndefined } from 'util';
import * as _ from 'underscore';
import { AuthService } from 'src/app/_services/gloabal/auth.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Modal } from 'src/app/_models/modal';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  product: Products;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  sizeArray = [];
  quantity = null;
  maxQuantity: number;
  selectedSize: string;
  selectedSizeObj = null;
  cartToken = environment.cartToken;
  cartItems = [];
  oldCartItems = [];
  modalBody: Modal = {};

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private authService: AuthService,
    private dialogComp: DialogComponent
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.product = data['product'];
    });

    this.slider();
    const rawSizes = JSON.parse(this.product.sizes);
    this.sizeArray = rawSizes.filter(x => x.quantity > 0);
  }

  onSelectChange() {
    this.selectedSizeObj = this.sizeArray.find(x => x.size.toLowerCase() == this.selectedSize.toLowerCase());
    this.maxQuantity = this.selectedSizeObj.quantity;
    //reset the quantity
    this.form.form.get('quantity').reset();
  }

  addToCart() {
    if (this.selectedSizeObj && this.quantity > 0) {
      if (this.quantity > this.maxQuantity) {
        return this.alertify.error('Quantity too large');
      }
    } else {
      return this.alertify.error('Select a size and quantity');
    }
    // add to cart
    const newCartItem = {
      size: this.selectedSize,
      quantity: this.quantity,
      productId: this.product.id
    };

    const oldItemFromStorage = localStorage.getItem(this.cartToken);
    // checks if cart items exits in the local storage
    if (oldItemFromStorage) {
      this.oldCartItems = JSON.parse(oldItemFromStorage);
      const productMatch = _.findWhere(this.oldCartItems, {
        size: this.selectedSize,
        productId: this.product.id
      });

      // checks if product is not already in the cart
      if (isUndefined(productMatch)) {
        this.oldCartItems.push(newCartItem);
        localStorage.setItem(this.cartToken, JSON.stringify(this.oldCartItems));
        this.authService.getTotalItemInCart();
        this.navigattionModal();
      } else {
        this.modalBody.title = 'Info.';
        this.modalBody.message = this.product.title + ' Item is already in Cart, Update the Quantity ?';
        this.modalBody.trueValue = 'Update Quantity';
        this.modalBody.falseValue = 'Cancel';

        this.dialogComp.openDialog(this.modalBody, () => {
          productMatch.quantity = productMatch.quantity + this.quantity;

          if (productMatch.quantity > this.maxQuantity) {
            return this.alertify.error('Quantity too large');
          }

          // get the index of the item
          const index = _.findIndex(this.oldCartItems, productMatch);

          // product already exist, increase product quantity
          this.oldCartItems.splice(index, 1, productMatch);
          localStorage.setItem(this.cartToken, JSON.stringify(this.oldCartItems));
          this.authService.getTotalItemInCart();
          this.navigattionModal();
        });
      }
    } else {
      // new cart
      this.cartItems.push(newCartItem);
      localStorage.setItem(this.cartToken, JSON.stringify(this.cartItems));
      this.authService.getTotalItemInCart();
      this.navigattionModal();
    }
  }

  navigattionModal() {
    this.modalBody.title = 'Success';
    this.modalBody.message = this.product.title + ' has been added to Cart';
    this.modalBody.trueValue = 'Continue Shopping';
    this.modalBody.falseValue = 'Go to Cart';

    this.dialogComp.openDialog(
      this.modalBody,
      () => {
        console.log('going to shop more');
      },
      () => {
        console.log('going to cart');
      }
    );
  }

  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.product.photos.length; i++) {
      imageUrls.push({
        small: this.product.photos[i].url,
        medium: this.product.photos[i].url,
        big: this.product.photos[i].url
      });
    }
    return imageUrls;
  }

  slider() {
    this.galleryOptions = [
      {
        width: '500px',
        height: '400px',
        imageSwipe: true,
        thumbnailsColumns: 4,
        imageAutoPlay: true,
        imageAutoPlayInterval: 5000,
        imageAutoPlayPauseOnHover: true,
        imageInfinityMove: true,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '500px',
        imagePercent: 80,
        imageSwipe: true,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }
}