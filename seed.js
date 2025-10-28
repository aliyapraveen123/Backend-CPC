import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

/**
 * Database Seeder
 * Populates database with sample data for testing
 * Run: node backend/seed.js
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'user@example.com',
    password: 'User@123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User@123',
    role: 'user',
  },
];

// Sample Products
const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Crystal clear sound quality with deep bass.',
    price: 299.99,
    discountPrice: 249.99,
    category: 'Electronics',
    stock: 50,
    brand: 'AudioTech',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Wireless Headphones' },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500', alt: 'Headphones Side View' }
    ],
    isFeatured: true,
    ratings: 4.5,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and water resistance.',
    price: 399.99,
    discountPrice: 349.99,
    category: 'Electronics',
    stock: 30,
    brand: 'TechFit',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Smart Watch' },
      { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500', alt: 'Watch Close Up' }
    ],
    isFeatured: true,
    ratings: 4.7,
  },
  {
    name: 'Laptop Computer',
    description: '15.6" Full HD laptop with Intel i7 processor, 16GB RAM, 512GB SSD. Perfect for work and gaming.',
    price: 1299.99,
    category: 'Computers',
    stock: 15,
    brand: 'CompuMax',
    images: [
      { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', alt: 'Laptop' },
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', alt: 'Laptop Side View' }
    ],
    isFeatured: true,
    ratings: 4.8,
  },
  {
    name: 'Smartphone X',
    description: '6.5" AMOLED display, 128GB storage, 48MP camera. Latest flagship smartphone.',
    price: 899.99,
    discountPrice: 799.99,
    category: 'Smartphones',
    stock: 40,
    brand: 'PhonePlus',
    images: [
      { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', alt: 'Smartphone' },
      { url: 'https://images.unsplash.com/photo-1592286927505-b35c8e6253ad?w=500', alt: 'Phone Display' }
    ],
    isFeatured: true,
    ratings: 4.6,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology. Available in multiple colors.',
    price: 129.99,
    category: 'Fashion',
    stock: 100,
    brand: 'SportFlex',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Running Shoes' },
      { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', alt: 'Shoes Side View' }
    ],
    ratings: 4.4,
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe. Brews 12 cups of perfect coffee.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'Home & Kitchen',
    stock: 60,
    brand: 'BrewMaster',
    images: [
      { url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', alt: 'Coffee Maker' },
      { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', alt: 'Coffee Cup' }
    ],
    ratings: 4.3,
  },
  {
    name: 'JavaScript Guide Book',
    description: 'Complete guide to modern JavaScript programming. From basics to advanced concepts.',
    price: 49.99,
    category: 'Books',
    stock: 200,
    brand: 'TechBooks',
    images: [
      { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', alt: 'JavaScript Book' },
      { url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', alt: 'Book Pages' }
    ],
    ratings: 4.9,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip exercise yoga mat with carrying strap. Perfect for home workouts.',
    price: 39.99,
    category: 'Sports',
    stock: 150,
    brand: 'FitLife',
    images: [
      { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', alt: 'Yoga Mat' },
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', alt: 'Yoga Practice' }
    ],
    ratings: 4.5,
  },
  {
    name: 'Facial Cleanser',
    description: 'Gentle daily facial cleanser for all skin types. Natural ingredients.',
    price: 24.99,
    category: 'Beauty',
    stock: 80,
    brand: 'GlowSkin',
    images: [
      { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', alt: 'Facial Cleanser' },
      { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', alt: 'Skincare Product' }
    ],
    ratings: 4.2,
  },
  {
    name: 'Building Blocks Set',
    description: 'Educational building blocks for kids. 500 pieces with instruction manual.',
    price: 59.99,
    category: 'Toys',
    stock: 45,
    brand: 'KidsFun',
    images: [
      { url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500', alt: 'Building Blocks' },
      { url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500', alt: 'Colorful Blocks' }
    ],
    ratings: 4.7,
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation and 8-hour battery life.',
    price: 149.99,
    discountPrice: 119.99,
    category: 'Electronics',
    stock: 75,
    brand: 'SoundMax',
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', alt: 'Wireless Earbuds' },
      { url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500', alt: 'Earbuds Case' }
    ],
    isFeatured: false,
    ratings: 4.6,
  },
  {
    name: '4K Gaming Monitor',
    description: '27-inch 4K UHD gaming monitor with 144Hz refresh rate and HDR support.',
    price: 549.99,
    discountPrice: 479.99,
    category: 'Computers',
    stock: 25,
    brand: 'ViewTech',
    images: [
      { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', alt: '4K Monitor' },
      { url: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500', alt: 'Gaming Setup' }
    ],
    isFeatured: true,
    ratings: 4.8,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard with blue switches and customizable lighting.',
    price: 129.99,
    category: 'Computers',
    stock: 60,
    brand: 'KeyMaster',
    images: [
      { url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', alt: 'Mechanical Keyboard' },
      { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', alt: 'RGB Keyboard' }
    ],
    ratings: 4.7,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI and rechargeable battery.',
    price: 39.99,
    category: 'Computers',
    stock: 100,
    brand: 'ClickPro',
    images: [
      { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', alt: 'Wireless Mouse' },
      { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', alt: 'Gaming Mouse' }
    ],
    ratings: 4.4,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360° sound and 20-hour battery life.',
    price: 79.99,
    discountPrice: 59.99,
    category: 'Electronics',
    stock: 85,
    brand: 'SoundWave',
    images: [
      { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', alt: 'Bluetooth Speaker' },
      { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500', alt: 'Portable Speaker' }
    ],
    ratings: 4.5,
  },
  {
    name: 'Tablet 10 inch',
    description: '10.1-inch Android tablet with 64GB storage and 8MP camera. Perfect for entertainment.',
    price: 299.99,
    discountPrice: 249.99,
    category: 'Smartphones',
    stock: 40,
    brand: 'TabMax',
    images: [
      { url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500', alt: 'Tablet' },
      { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', alt: 'Tablet Display' }
    ],
    ratings: 4.3,
  },
  {
    name: 'DSLR Camera',
    description: 'Professional 24MP DSLR camera with 18-55mm lens kit. Perfect for photography enthusiasts.',
    price: 899.99,
    category: 'Electronics',
    stock: 20,
    brand: 'PhotoPro',
    images: [
      { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', alt: 'DSLR Camera' },
      { url: 'https://images.unsplash.com/photo-1606403543670-a24d7e1c4e88?w=500', alt: 'Camera Lens' }
    ],
    isFeatured: true,
    ratings: 4.9,
  },
  {
    name: 'Backpack Laptop Bag',
    description: 'Water-resistant laptop backpack with USB charging port and multiple compartments.',
    price: 49.99,
    category: 'Fashion',
    stock: 120,
    brand: 'TravelGear',
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Laptop Backpack' },
      { url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500', alt: 'Travel Backpack' }
    ],
    ratings: 4.6,
  },
  {
    name: 'Fitness Tracker Band',
    description: 'Smart fitness band with heart rate monitor, sleep tracking, and 7-day battery life.',
    price: 59.99,
    discountPrice: 44.99,
    category: 'Electronics',
    stock: 90,
    brand: 'FitBand',
    images: [
      { url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500', alt: 'Fitness Tracker' },
      { url: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=500', alt: 'Smart Band' }
    ],
    ratings: 4.2,
  },
  {
    name: 'Electric Kettle',
    description: 'Stainless steel electric kettle with auto shut-off and 1.7L capacity.',
    price: 34.99,
    category: 'Home & Kitchen',
    stock: 70,
    brand: 'QuickBoil',
    images: [
      { url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500', alt: 'Electric Kettle' },
      { url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500', alt: 'Modern Kitchen' }
    ],
    ratings: 4.4,
  },
  {
    name: 'Desk Lamp LED',
    description: 'Adjustable LED desk lamp with touch control and USB charging port.',
    price: 44.99,
    category: 'Home & Kitchen',
    stock: 65,
    brand: 'BrightLight',
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', alt: 'Desk Lamp' },
      { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500', alt: 'LED Lamp' }
    ],
    ratings: 4.5,
  },
  {
    name: 'Sunglasses Polarized',
    description: 'UV protection polarized sunglasses with metal frame. Classic aviator style.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'Fashion',
    stock: 80,
    brand: 'StyleVision',
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', alt: 'Sunglasses' },
      { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500', alt: 'Aviator Sunglasses' }
    ],
    ratings: 4.3,
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set with 5-25 lbs weight range. Perfect for home gym.',
    price: 149.99,
    category: 'Sports',
    stock: 35,
    brand: 'FitPower',
    images: [
      { url: 'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=500', alt: 'Dumbbells' },
      { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', alt: 'Gym Equipment' }
    ],
    ratings: 4.7,
  },
  {
    name: 'Professional Basketball',
    description: 'Official size basketball with superior grip. Indoor/outdoor use. Durable rubber construction.',
    price: 34.99,
    category: 'Sports',
    stock: 120,
    brand: 'ProSport',
    images: [
      { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', alt: 'Basketball' },
      { url: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500', alt: 'Basketball Court' }
    ],
    isFeatured: true,
    ratings: 4.8,
  },
  {
    name: 'Soccer Football',
    description: 'Premium FIFA quality soccer ball. Size 5, professional match ball with perfect air retention.',
    price: 44.99,
    discountPrice: 39.99,
    category: 'Sports',
    stock: 95,
    brand: 'GoalKing',
    images: [
      { url: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500', alt: 'Soccer Ball' },
      { url: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=500', alt: 'Football on Field' }
    ],
    isFeatured: true,
    ratings: 4.9,
  },
  {
    name: 'Wall Clock Modern',
    description: 'Silent non-ticking wall clock with modern design. Battery operated.',
    price: 29.99,
    category: 'Home & Kitchen',
    stock: 95,
    brand: 'TimeDesign',
    images: [
      { url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500', alt: 'Wall Clock' },
      { url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500', alt: 'Modern Clock' }
    ],
    ratings: 4.1,
  },
  {
    name: 'Cookbook Collection',
    description: 'Complete cookbook collection with 500+ recipes from around the world.',
    price: 39.99,
    category: 'Books',
    stock: 110,
    brand: 'ChefBooks',
    images: [
      { url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500', alt: 'Cookbook' },
      { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500', alt: 'Recipe Book' }
    ],
    ratings: 4.8,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.create(
      products.map((product) => ({
        ...product,
        createdBy: createdUsers[0]._id, // Assign admin as creator
      }))
    );
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create sample reviews
    console.log('⭐ Adding sample reviews...');
    const sampleReviews = [
      {
        user: createdUsers[1]._id,
        name: createdUsers[1].name,
        rating: 5,
        comment: 'Excellent product! Highly recommended.',
      },
      {
        user: createdUsers[2]._id,
        name: createdUsers[2].name,
        rating: 4,
        comment: 'Good quality, fast delivery.',
      },
    ];

    for (let i = 0; i < Math.min(5, createdProducts.length); i++) {
      const product = createdProducts[i];
      product.reviews = sampleReviews;
      product.calculateAverageRating();
      await product.save();
    }

    // Create sample order
    console.log('🛒 Creating sample order...');
    const sampleOrder = {
      user: createdUsers[1]._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          quantity: 2,
          image: createdProducts[0].images[0].url,
          price: createdProducts[0].discountPrice || createdProducts[0].price,
        },
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          quantity: 1,
          image: createdProducts[1].images[0].url,
          price: createdProducts[1].discountPrice || createdProducts[1].price,
        },
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '+1-555-0123',
      },
      paymentInfo: {
        method: 'Card',
        status: 'Completed',
      },
      itemsPrice: 849.97,
      taxPrice: 84.99,
      shippingPrice: 0,
      totalAmount: 934.96,
      orderStatus: 'Delivered',
    };

    await Order.create(sampleOrder);
    console.log('✅ Created sample order');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: admin@ecommerce.com / Admin@123');
    console.log('   User:  user@example.com / User@123');
    console.log('\n✨ You can now start the application!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
