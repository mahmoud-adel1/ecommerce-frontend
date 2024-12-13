import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history.service';
import { OrderHistory } from '../../common/order-history';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {

  storage: Storage = sessionStorage;
  orderHistoryList: OrderHistory[] = [];
  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(data => {
      this.orderHistoryList = data._embedded.orders;
    })
  }



}
