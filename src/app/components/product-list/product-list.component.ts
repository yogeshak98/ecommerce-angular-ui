import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;

  constructor(
    private productServcie: ProductService, 
    private route: ActivatedRoute
    ) { 

  }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");
    if (hasCategoryId){
      // get id and coonvert it to number
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get("id"));
    }
    else{
      this.currentCategoryId = 1;
    }
    
    this.productServcie.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
