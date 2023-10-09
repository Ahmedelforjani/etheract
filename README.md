## Description

This is source code of [Etheract](https://ethact.vercel.app/) website.

What is Etheract? it is a web tool that allows users to interact with unverified smart contract methods in multiple blockchain networks with simple UI. It is designed to make it easy to call any function of any smart contract, even if the contract source code is not verified on Etherscan or other block explorers. Users can connect their wallets using MetaMask, WalletConnect, or Coinbase Wallet and enter the contract address and ABI (Application Binary Interface) of the smart contract they want to interact with and it will be stored on browser localstorage. Etheract will then display the available functions and let the user input the parameters and execute the function.

## Prerequisites

Website was developed using [Next.js](https://github.com/vercel/next.js) that uses [Node.js](https://nodejs.org/en) 16.14 or later.

## Running locally

Download the project and navigate to the root folder (the one with this file), then execute

`npm install`

`npm run dev`

Website will be accessible on http://localhost:3000/

To build the bundle, execute

`npm run build`

## License

Licensed under the [MIT license](./LICENSE.md).
