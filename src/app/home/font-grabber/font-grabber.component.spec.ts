import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontGrabberComponent } from './font-grabber.component';

describe('FontGrabberComponent', () => {
  let component: FontGrabberComponent;
  let fixture: ComponentFixture<FontGrabberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontGrabberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontGrabberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
