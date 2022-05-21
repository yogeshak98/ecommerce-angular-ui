import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];

  constructor(private productServcie: ProductService) { 

  }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(){
    this.productServcie.getProductList().subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
