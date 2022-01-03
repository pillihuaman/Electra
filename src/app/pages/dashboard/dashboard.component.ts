import { UserRepository } from 'src/app/@domain/repository/user.repository';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private userRepository :UserRepository ) {}

  ngOnInit(): void
  {

    this.getUser();

    
  }

  getUser()
  { 
    this.userRepository.getusers

       this.userRepository
      .getusers()
         .subscribe((mc) =>
         {
           let v = mc;
    
      });

  }
}
