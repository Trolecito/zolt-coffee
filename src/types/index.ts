export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'cafe' | 'frappes' | 'malteadas' | 'snacks';
  featured?: boolean;
}

export interface GiftCard {
  id: string;
  title: string;
  occasion: string;
  image: string;
  description: string;
}

export interface GiftCardOrder {
  id?: string;
  giftCardId: string;
  amount: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  giftCode?: string;
  status?: 'pending' | 'sent' | 'delivered';
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
}

export interface AuthForm {
  email: string;
  password: string;
  name?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  pickupPersonName: string;
  ticketEmail: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
}

export interface OrderTicket {
  ticketNumber: string;
  orderDate: string;
  pickupPersonName: string;
  store: Store;
  items: CartItem[];
  total: number;
  estimatedTime: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentInfo: PaymentForm;
  selectedStore: Store;
  ticket: OrderTicket;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
}