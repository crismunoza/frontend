import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditiniComponent } from './editini.component';

describe('EditiniComponent', () => {
  let component: EditiniComponent;
  let fixture: ComponentFixture<EditiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditiniComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
