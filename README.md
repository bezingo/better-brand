# Better Brand

A modern e-commerce brand with Adyen payment integration.

## About

Better Brand is a premium e-commerce platform offering high-quality products with a seamless shopping experience. Our platform features:

- Modern, responsive design
- Secure payment processing with Adyen
- Multiple payment options (Credit/Debit cards, Apple Pay, Google Pay)
- User account management
- Order tracking
- Product recommendations

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Payment Processing**: Adyen Web SDK
- **Authentication**: Custom authentication system
- **Styling**: Tailwind CSS with custom components
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Adyen test account with API key and client key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Adyen API credentials
ADYEN_API_KEY=your_adyen_api_key
ADYEN_MERCHANT_ACCOUNT=your_adyen_merchant_account
NEXT_PUBLIC_ADYEN_CLIENT_KEY=your_adyen_client_key

# Other environment variables
# ...
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bezingo/better-brand.git
cd better-brand
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Product Catalog**: Browse and search products by category
- **Shopping Cart**: Add, remove, and update items in your cart
- **Checkout Process**: Seamless checkout with Adyen payment integration
- **User Accounts**: Create an account, manage profile, and view order history
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)

## License

MIT