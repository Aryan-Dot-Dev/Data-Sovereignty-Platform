# DataMarketplace Frontend

A decentralized marketplace for buying and selling data assets using blockchain technology and IPFS storage.

## Features

- Connect to Ethereum wallet (MetaMask)
- Register as a user or company
- Upload data to IPFS
- List data assets on the marketplace
- Browse and search for data assets
- Purchase data assets
- User dashboard for sellers
- Company dashboard for buyers

## Tech Stack

- React 18
- Vite
- Ethers.js for blockchain interactions
- IPFS/Pinata for decentralized storage
- Tailwind CSS for styling
- React Router for navigation

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask or another Ethereum wallet browser extension
- Pinata API JWT (for IPFS uploads)

## Setup

1. Clone the repository

```bash
git clone <repository-url>
cd mini-project/frontend
```

2. Run the setup script

For Windows:
```bash
setup.bat
```

For Unix/Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Install all required dependencies
- Create a `.env` file from the example if one doesn't exist

3. Configure environment variables

Edit the `.env` file and update:
- `VITE_PINATA_JWT` with your Pinata JWT token
- `VITE_CONTRACT_ADDRESS` with your deployed contract address (if different)

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173/

## Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

- `/src` - Source code
  - `/components` - UI components
    - `/layout` - Layout components (Navbar, Footer, etc.)
    - `/ui` - Reusable UI components
  - `/context` - React context for global state
  - `/pages` - Page components
  - `/utils` - Utility functions
  - `/assets` - Static assets

## Smart Contract

This frontend interacts with the DataMarketplace smart contract located in the `/blockchain` directory. Make sure the contract is deployed before using this application.

## License

[MIT](LICENSE)
