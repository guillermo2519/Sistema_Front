import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPendientesUserComponent } from './modal-pendientes-user.component';

describe('ModalPendientesUserComponent', () => {
  let component: ModalPendientesUserComponent;
  let fixture: ComponentFixture<ModalPendientesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPendientesUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPendientesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
