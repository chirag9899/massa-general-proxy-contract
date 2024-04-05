import { stringToBytes, Args } from '@massalabs/as-types';
import { _delegate } from '../contracts/proxy';
import { constructor, getGeneratedEvents } from '../contracts/main';
import {
  Address,
  Storage,
  createSC,
  fileToByteArray,
  getOpData,
  print,
} from '@massalabs/massa-as-sdk';
import { main } from '../contracts/createContract';

describe('General Proxy Contract Test Suite', () => {
  beforeAll(() => {
    // Deploy the contract
    const wasmPath = './build/main.wasm';
    print(`Attempting to read WASM file from path: ${wasmPath}`);
    const wasmBytes: StaticArray<u8> = fileToByteArray(wasmPath);
    print(`Contents of WASM file: ${wasmBytes}`);
    print(`Bytes read from WASM file: ${wasmBytes.length}`); // Print the length of the byte array
    const contractAddress: Address = createSC(wasmBytes);
    Storage.set('contractAddress', contractAddress.toString());
    print(contractAddress.toString());
  });

  test('Testing constructor', () => {
    const name = 'MyProxy';
    const args = new Args().add(stringToBytes(name));
    constructor(args.serialize());

    // Check if the expected event was generated
    const generatedEvents = getGeneratedEvents();
    expect(generatedEvents.length).toBe(1);
    expect(generatedEvents[0]).toBe(`Constructor called with name ${name}`);
  });

  test('getting contract address', () => {
    const wasmPath = './build/proxy.wasm';
    const wasmBytes: StaticArray<u8> = fileToByteArray(wasmPath);
    print(`this wasbytes ${wasmBytes.toString()}`);
    const data = main();
    print(data.toString());
  });

  //   test('Testing _delegate', () => {
  //     const targetAddress = new Address(Storage.get("contractAddress"));
  //     const functionName = "saveSomething";
  //     const args = ["hello world"];
  //     const binaryArgs = new Args()
  //       .add(stringToBytes(targetAddress.toString()))
  //       .add(stringToBytes(functionName))
  //       .add(args)
  //       .serialize();

  //     _delegate(binaryArgs);

  //     // Check if the expected event was generated
  //     const generatedEvents = getGeneratedEvents();
  //     const expectedResult = `Call to ${targetAddress}.${functionName} returned ["hello world"]`;
  //     expect(generatedEvents[1]).toBe(expectedResult);
  //   });
  // });
  //   test('Testing _delegate', () => {
  //     const targetAddress = new Address(Storage.get("contractAddress"));
  //     const functionName = "saveSomething";
  //     const args = ["hello world"];
  //     const binaryArgs = new Args()
  //       .add(stringToBytes(targetAddress.toString()))
  //       .add(stringToBytes(functionName))
  //       .add(args)
  //       .serialize();

  //     _delegate(binaryArgs);

  //     // Check if the expected event was generated
  //     const generatedEvents = getGeneratedEvents();
  //     const expectedResult = `Call to ${targetAddress}.${functionName} returned ["hello world"]`;
  //     expect(generatedEvents[1]).toBe(expectedResult);
  //   });
});
