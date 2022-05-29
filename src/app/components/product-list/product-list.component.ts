import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  currentKeyword: string = "";
  previousKeyword: string = "";

  // pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;



  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute,
    private cartService: CartService
    ) { 

  }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(event: Event){
    this.pageSize = Number((event.target as HTMLInputElement).value);
    this.pageNumber = 1;
    this.listProducts();
  }

  handleListProducts(){
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");
    if (hasCategoryId){
      // get id and coonvert it to number
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get("id"));
    }
    else{
      this.currentCategoryId = 1;
    }

    // check if we have a differnt category than previous then reset pagenumber to 1
    if (this.previousCategoryId != this.currentCategoryId){
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService
    .getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
    .subscribe(data => this.processGetResponseProducts(data));
  }

  processGetResponseProducts(data: any){
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
  }

  handleSearchProducts(){
    const keyword = String(this.route.snapshot.paramMap.get("keyword"));
        // check if we have a differnt category than previous then reset pagenumber to 1
    if (this.previousKeyword != this.currentKeyword){
      this.pageNumber = 1;
    }
    this.previousKeyword = this.currentKeyword;

    this.productService
      .searchProductsPaginate(this.pageNumber - 1, this.pageSize, this.currentKeyword)
      .subscribe(data => this.processGetResponseProducts(data));
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode)
      return this.handleSearchProducts();
    return this.handleListProducts();
  }

  addToCart(product: Product){
    this.cartService.addToCart(new CartItem(product));
  }
}
