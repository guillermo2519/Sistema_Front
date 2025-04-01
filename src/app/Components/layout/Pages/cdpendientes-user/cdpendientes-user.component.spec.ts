import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDPendientesUserComponent } from './cdpendientes-user.component';

describe('CDPendientesUserComponent', () => {
  let component: CDPendientesUserComponent;
  let fixture: ComponentFixture<CDPendientesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDPendientesUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDPendientesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
