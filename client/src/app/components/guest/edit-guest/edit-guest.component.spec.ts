import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGuestComponent } from './edit-guest.component';

describe('EditGuestComponent', () => {
  let component: EditGuestComponent;
  let fixture: ComponentFixture<EditGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
