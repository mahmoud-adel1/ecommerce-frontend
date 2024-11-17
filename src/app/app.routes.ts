import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
    {path:'category/:id', component: ProductListComponent},
    {path:'category/:id/:name', component: ProductListComponent},
    {path:'search/:keyword', component: ProductListComponent},
    {path:'products/:id', component: ProductDetailsComponent},
    {path:'category', component: ProductListComponent},
    {path:'products', component: ProductListComponent},
    {path:'', redirectTo: '/products', pathMatch: 'full'},
    {path:'**', redirectTo: '/products', pathMatch: 'full'},
];
