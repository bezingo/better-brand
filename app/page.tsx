import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between py-12 gap-8">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Better Brand</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Premium products for a better lifestyle. Discover our collection of high-quality items.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/shop" 
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 border border-black dark:border-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 relative h-[400px] w-full rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
            Hero Image Placeholder
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Product Image {item}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Product {item}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Product description goes here</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$99.99</span>
                  <button className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            href="/shop" 
            className="px-6 py-3 border border-black dark:border-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-block"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 -mx-4 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">All our products are made with the highest quality materials.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">Get your products delivered to your doorstep within 2-3 business days.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600 dark:text-gray-300">Multiple payment options with secure checkout powered by Adyen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Stay updated with our latest products and offers.</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}