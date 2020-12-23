import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontItemComponent } from './font-item.component';

describe('FontItemComponent', () => {
  let component: FontItemComponent;
  let fixture: ComponentFixture<FontItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
