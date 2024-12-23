import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardCartItemComponent } from './card-cart-item.component';
import { Store } from '@ngxs/store';
import {
  DecrementQuantity,
  IncrementQuantity,
  RemoveFromCart,
} from '../../state/cart/cart.actions';
import { ProductState } from '../../state/product/product.state';

describe('CardCartItemComponent', () => {
  let component: CardCartItemComponent;
  let fixture: ComponentFixture<CardCartItemComponent>;
  let mockData: any;

  beforeEach(async () => {
    mockData = {
      dispatch: jasmine.createSpy(),
      selectSnapshot: jasmine.createSpy().and.callFake((selector) => {
        if (selector === ProductState.getProducts) {
          return [
            { id: 1, name: 'Laptop', price: 1000, stock: 5 },
            { id: 2, name: 'Mouse', price: 50, stock: 2 },
          ];
        }
        return [];
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CardCartItemComponent],
      providers: [
        {
          provide: Store,
          useValue: mockData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCartItemComponent);
    component = fixture.componentInstance;
    component.item = { productId: 1, name: 'Laptop', price: 1000, quantity: 2 };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedProduct on ngOnInit', () => {
    component.ngOnInit();
    expect(component.selectedProduct).toEqual({
      id: 1,
      name: 'Laptop',
      price: 1000,
      stock: 5,
    });
  });

  it('should dispatch IncrementQuantity action when incrementQuantity called', () => {
    component.incrementQuantity();
    expect(mockData.dispatch).toHaveBeenCalledWith(new IncrementQuantity(1));
  });

  it('should dispatch DecrementQuantity action when decrementQuantity called', () => {
    component.decrementQuantity();
    expect(mockData.dispatch).toHaveBeenCalledWith(new DecrementQuantity(1));
  });

  it('should dispatch RemoveFromCart action when removeFromCart is called', () => {
    spyOn(window, 'alert');
    component.removeFromCart();
    expect(mockData.dispatch).toHaveBeenCalledWith(new RemoveFromCart(1));
    expect(window.alert).toHaveBeenCalledWith('Ürün sepetten çıkarıldı.');
  });

  it('should disable + button if stock limit reached', () => {
    component.item.quantity = 5;
    fixture.detectChanges();

    const incrementButton = fixture.nativeElement.querySelector(
      '.quantity-control'
    ) as HTMLButtonElement;

    expect(incrementButton.disabled).toBeTrue();
    expect(incrementButton.classList).toContain('disable');
  });

  it('should enable + button if stock limit not reached', () => {
    component.item.quantity = 3; // not out of stock
    fixture.detectChanges();

    const incrementButton = fixture.nativeElement.querySelector(
      '.quantity-control'
    ) as HTMLButtonElement;

    expect(incrementButton.disabled).toBeFalse();
    expect(incrementButton.classList).not.toContain('disable');
  });

  it('should correctly display cart item data in the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const nameElement = compiled.querySelector('.cart-item span')!;
    const totalElement = compiled.querySelector('.cart-item p')!;
    const nameText = nameElement.textContent?.replace(/\s+/g, ' ').trim(); // fixed space with &nbsp;
    expect(nameElement.textContent).toContain('Laptop');
    expect(nameText).toContain('x 2');
    expect(totalElement.textContent).toContain('2000 TL');
  });
});
