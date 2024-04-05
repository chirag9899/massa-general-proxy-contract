import { Address, createSC, fileToByteArray, generateEvent, print } from '@massalabs/massa-as-sdk';

export function main(): Address {

  const bytes: StaticArray<u8>  = fileToByteArray('./build/main.wasm'); 

  const contractAddress = createSC(bytes);

  print(` my contract address is ${contractAddress.toString()}`);
  generateEvent(`Contract deployed at ${contractAddress.toString()}`);

  return contractAddress;
}


