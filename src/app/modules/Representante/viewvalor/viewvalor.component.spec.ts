import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewvalorComponent } from './viewvalor.component';

describe('ViewvalorComponent', () => {
  let component: ViewvalorComponent;
  let fixture: ComponentFixture<ViewvalorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewvalorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewvalorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
