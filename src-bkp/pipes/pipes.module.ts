import { NgModule } from '@angular/core';
import { SortPipe } from './sort/sort';
import { OrderByPipe } from './order-by/order-by';
@NgModule({
	declarations: [
	SortPipe,
//	OrderByPipe
],
	imports: [],
	exports: [
	SortPipe,
//	OrderByPipe
]
})
export class PipesModule {}
