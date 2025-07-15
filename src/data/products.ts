import { Product } from '../types';

export const products: Product[] = [
  // Café
  {
    id: 1,
    name: 'Cappuccino Clásico',
    description: 'Espresso con leche vaporizada y espuma cremosa',
    price: 45,
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'cafe',
    featured: true
  },
  {
    id: 2,
    name: 'Americano',
    description: 'Espresso doble con agua caliente',
    price: 35,
    image: 'https://images.pexels.com/photos/3653799/pexels-photo-3653799.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'cafe'
  },
  {
    id: 3,
    name: 'Latte Vainilla',
    description: 'Espresso con leche vaporizada y jarabe de vainilla',
    price: 50,
    image: 'https://images.pexels.com/photos/20205947/pexels-photo-20205947.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'cafe',
    featured: true
  },
  {
    id: 4,
    name: 'Espresso Doble',
    description: 'Doble shot de espresso puro',
    price: 30,
    image: 'https://images.pexels.com/photos/9795333/pexels-photo-9795333.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'cafe'
  },
  {
    id: 15,
    name: 'Macchiato Caramelo',
    description: 'Espresso con leche vaporizada y caramelo',
    price: 55,
    image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'cafe'
  },
  {
    id: 16,
    name: 'Mocha Chocolate',
    description: 'Espresso con chocolate caliente y crema',
    price: 60,
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'cafe'
  },
  {
    id: 17,
    name: 'Café Turco',
    description: 'Café tradicional turco con especias',
    price: 40,
    image: 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'cafe'
  },

  // Frappes
  {
    id: 5,
    name: 'Frappe Caramelo',
    description: 'Café helado con caramelo y crema batida',
    price: 65,
    image: 'https://images.pexels.com/photos/2638026/pexels-photo-2638026.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'frappes',
    featured: true
  },
  {
    id: 6,
    name: 'Frappe Moca',
    description: 'Café helado con chocolate y crema',
    price: 70,
    image: 'https://images.pexels.com/photos/32997615/pexels-photo-32997615.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'frappes'
  },
  {
    id: 7,
    name: 'Frappe Vainilla',
    description: 'Café helado con vainilla y crema batida',
    price: 60,
    image: 'https://images.pexels.com/photos/32972553/pexels-photo-32972553.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'frappes'
  },
  {
    id: 18,
    name: 'Frappe Cookies & Cream',
    description: 'Café helado con galletas Oreo trituradas',
    price: 75,
    image: 'https://images.pexels.com/photos/31012709/pexels-photo-31012709.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'frappes'
  },
  {
    id: 19,
    name: 'Frappe Nutella',
    description: 'Café helado con Nutella y avellanas',
    price: 80,
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'frappes'
  },

  {
    id: 20,
    name: 'Frappe Matcha',
    description: 'Té matcha helado con crema batida',
    price: 70,
    image: 'https://images.pexels.com/photos/5946965/pexels-photo-5946965.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'frappes'
  },

  // Malteadas
  {
    id: 8,
    name: 'Malteada Chocolate',
    description: 'Cremosa malteada de chocolate con crema',
    price: 75,
    image: 'https://images.pexels.com/photos/12365249/pexels-photo-12365249.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'malteadas',
    featured: true
  },
  {
    id: 9,
    name: 'Malteada Fresa',
    description: 'Malteada de fresa natural con crema',
    price: 70,
    image: 'https://images.pexels.com/photos/6463659/pexels-photo-6463659.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'malteadas'
  },
  {
    id: 10,
    name: 'Malteada Vainilla',
    description: 'Clásica malteada de vainilla',
    price: 65,
    image: 'https://images.pexels.com/photos/32972553/pexels-photo-32972553.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'malteadas'
  },
  {
    id: 21,
    name: 'Malteada Oreo',
    description: 'Malteada con galletas Oreo trituradas',
    price: 80,
    image: 'https://images.pexels.com/photos/28525199/pexels-photo-28525199.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'malteadas'
  },
  {
    id: 22,
    name: 'Malteada Plátano',
    description: 'Malteada natural de plátano con miel',
    price: 70,
    image: 'https://images.pexels.com/photos/12049998/pexels-photo-12049998.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'malteadas'
  },
  {
    id: 23,
    name: 'Malteada Mango',
    description: 'Malteada tropical de mango natural',
    price: 75,
    image: 'https://images.pexels.com/photos/8679358/pexels-photo-8679358.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'malteadas'
  },

  // Snacks
  {
    id: 11,
    name: 'Croissant Jamón y Queso',
    description: 'Croissant horneado con jamón y queso',
    price: 55,
    image: 'https://images.pexels.com/photos/7390/food-plate-wood-kitchen.jpg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  },
  {
    id: 12,
    name: 'Muffin Arándanos',
    description: 'Muffin casero con arándanos frescos',
    price: 40,
    image: 'https://images.pexels.com/photos/2254063/pexels-photo-2254063.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  },
  {
    id: 13,
    name: 'Sandwich Club',
    description: 'Sandwich de pollo, tocino y verduras',
    price: 85,
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  },
  {
    id: 14,
    name: 'Cheesecake',
    description: 'Rebanada de cheesecake con frutos rojos',
    price: 60,
    image: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  },
  {
    id: 24,
    name: 'Bagel Salmón',
    description: 'Bagel con salmón ahumado y queso crema',
    price: 95,
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  },
  {
    id: 25,
    name: 'Wrap Pollo',
    description: 'Wrap de pollo con vegetales frescos',
    price: 75,
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  },
  {
    id: 26,
    name: 'Ensalada César',
    description: 'Ensalada César con pollo y crutones',
    price: 80,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  },
  {
    id: 27,
    name: 'Panini Caprese',
    description: 'Panini con tomate, mozzarella y albahaca',
    price: 70,
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'snacks'
  }
];

export const featuredProducts = products.filter(product => product.featured);