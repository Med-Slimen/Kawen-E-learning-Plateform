import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  firestore=inject(Firestore);
  categories?:Category[];
  constructor() {}
  async ngOnInit(){
    this.categories=await this.getAllCategories();
  }
  async getAllCategories() : Promise<Category[]> {
    const snap= await getDocs(collection(this.firestore, 'categories'));
    this.categories= snap.docs.map((categoryDoc)=>{
      const categoryDetails=categoryDoc.data() as Omit<Category, 'uid'>;
      return {
        uid: categoryDoc.id,
        ...categoryDetails
      } as Category;
    });
    return this.categories;
  }
  async getCategoryByTitle(title:string): Promise<Category | undefined> {
    await this.ngOnInit();
    return this.categories?.find(category => category.title === title);
  }
}
