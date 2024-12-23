import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { CartState } from '../../state/cart/cart.state';
import { ActivatedRoute } from '@angular/router';
import { CardCartItemComponent } from '../card-cart-item/card-cart-item.component';
import { By } from '@angular/platform-browser';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockData: any;
  beforeEach(async () => {
    mockData = {
      select: jasmine.createSpy().and.callFake((item) => {
        if (item === CartState.getTotalPrice) {
          return of(1000);
        }
        if (item === CartState.getCartItems) {
          return of([
            { id: 1, name: 'Laptop', price: 1000, stock: 5 },
            { id: 2, name: 'Mouse', price: 50, stock: 2 },
          ]);
        }
        if (item === CartState.getTotalItemsCount) {
          return of(3);
        }
        return of([]);
      }),
      selectSnapshot: jasmine.createSpy().and.callFake((selector) => {
        if (selector === CartState.getCartItems) {
          return [
            { id: 1, name: 'Laptop', price: 1000, stock: 5 },
            { id: 2, name: 'Mouse', price: 50, stock: 2 },
          ];
        }
        if (selector === CartState.getTotalItemsCount) {
          return 3;
        }
        return [];
      }),
    };

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, CardCartItemComponent],
      providers: [
        { provide: Store, useValue: mockData },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show total price correctly', () => {
    const cartInfoElement = fixture.nativeElement.querySelector('.cart-info');
    expect(cartInfoElement.textContent).toContain('1000 TL');
  });

  it('should display total item count correctly', () => {
    const element = fixture.nativeElement as HTMLElement;
    const badge = element.querySelector('.cart-count-badge')!;
    expect(badge.textContent).toContain('3');
  });

  it('should hide cart count badge when hideCartFromLayout is true', () => {
    component.hideCartFromLayout = true;
    fixture.detectChanges();
    const cartBadgeWrapper = fixture.nativeElement.querySelector(
      '.cart-badge-wrapper'
    );
    expect(cartBadgeWrapper).toBeNull();
  });

  it('should show cart summary box on mouse enter', () => {
    const badge = fixture.debugElement.query(By.css('.cart-badge-area'));
    badge.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();
    expect(component.showCartSummaryBox).toBeTrue();
    const element = fixture.nativeElement as HTMLElement;
    const summaryPopup = element.querySelector('.cart-summary-wrapper')!;
    expect(summaryPopup).toBeTruthy();
  });

  it('should hide cart summary box on mouse leave', () => {
    const badge = fixture.debugElement.query(By.css('.cart-badge-area'));
    badge.triggerEventHandler('mouseleave', {});
    fixture.detectChanges();
    expect(component.showCartSummaryBox).toBeFalse();
  });

  it('should show page content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.nativeElement.innerHTML = `<app-layout><p>Test Content</p></app-layout>`;
    fixture.detectChanges();
    expect(compiled.querySelector('p')?.textContent).toContain('Test Content');
  });
});
