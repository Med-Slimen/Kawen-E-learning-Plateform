import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { collection, Firestore, updateDoc } from '@angular/fire/firestore';
import { addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/categoryService/category-service';

@Component({
  selector: 'app-admin-category-page',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-category-page.html',
  styleUrl: './admin-category-page.css',
})
export class AdminCategoryPage implements OnInit {
  categories?:Category[];
  editedCategory?:Category;
  category?:Omit<Category, 'uid'>;
  addError?:number;
  editMenuOpen=false;
  firestore=inject(Firestore);
  cateogryService=inject(CategoryService);
  categoryForm: FormGroup;
  editCategoryForm: FormGroup;
  editError?:number;
  constructor(private formBuilder:FormBuilder) {
    this.categoryForm = this.formBuilder.group({
      title: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      description: ['',[Validators.required, Validators.minLength(10),Validators.maxLength(200)]],
    });
    this.editCategoryForm = this.formBuilder.group({
      title: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      description: ['',[Validators.required, Validators.minLength(10),Validators.maxLength(200)]],
    });
  }
  async ngOnInit(){
    this.categories=await this.getAllCategories();
  }
  async getAllCategories() : Promise<Category[]> {
    return await this.cateogryService.getAllCategories();
  }
  async addCategory() : Promise<void> {
    this.category ={
      title: this.categoryForm.value.title,
      description: this.categoryForm.value.description
    }
    addDoc(collection(this.firestore, 'categories'),this.category).then((docRef)=>{
      this.addError=0;
      this.category=undefined;
      this.ngOnInit();
      this.categoryForm.reset();
    }).catch((error)=>{
      this.addError=1;
    });
  }
  getCategoryByTitle(title:string): Category | undefined {
    return this.categories?.find(category => category.title === title);
  }
   deleteCategory(category:Category): void {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      if (!category) {
        console.error("Category not found: ", category);
        return;
      }
      deleteDoc(doc(this.firestore, `categories/${category.uid}`)).then(() => {
        alert("Category deleted successfully.");
        this.ngOnInit();
      }).catch((error) => {
        console.error("Error deleting category: ", error);
      });
    }
  }
  openEditMenu(category: Category): void {
    this.editMenuOpen = true;
    this.editedCategory = category;
    this.editCategoryForm.reset();
    this.editCategoryForm.patchValue({
      title: category.title,
      description: category.description
    });
  }
  closeEditMenu(): void {
    this.editMenuOpen = false;
    this.editedCategory = undefined;
  }
  editCategory(): void {
    const finalEditedCategory:Omit<Category, 'uid'>  = {
      title: this.editCategoryForm.value.title,
      description: this.editCategoryForm.value.description
    };
    updateDoc(doc(this.firestore, `categories/${this.editedCategory?.uid}`),finalEditedCategory).then(() => {
      this.editError = 0;
      this.editedCategory = undefined;
      this.editCategoryForm.reset();
      this.editMenuOpen = false;
      this.ngOnInit();
    }).catch((error) => {
      this.editError = 1;
    });
  }
}
