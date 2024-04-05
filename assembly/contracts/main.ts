// The entry file of your WebAssembly module.
import {
  Context,
  Storage,
  generateEvent,
  print,
} from '@massalabs/massa-as-sdk';
import { Args, stringToBytes } from '@massalabs/as-types';

let generatedEvents: string[] = [];

export function getGeneratedEvents(): string[] {
  return generatedEvents;
}

function captureEvent(message: string): void {
  generatedEvents.push(message);
}

/**
 * This function is meant to be called only one time: when the contract is deployed.
 *
 * @param binaryArgs - Arguments serialized with Args
 */
export function constructor(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  // This line is important. It ensures that this function can't be called in the future.
  // If you remove this check, someone could call your constructor function and reset your smart contract.

  // if (!Context.isDeployingContract()) {
  //   return [];
  // }
  const argsDeser = new Args(binaryArgs);
  const name = argsDeser
    .nextString()
    .expect('Name argument is missing or invalid');
  const eventMessage = `Constructor called with name ${name}`;
  captureEvent(eventMessage);
  return [];
}

/**
 * @param _ - not used
 * @returns the emitted event serialized in bytes
 */

export function saveSomething(binaryArgs: StaticArray<u8>): void {
  const argsDeser = new Args(binaryArgs);
  const name = argsDeser
    .nextString()
    .expect('Name argument is missing or invalid');
  Storage.set('data', name);
}

export function event(_: StaticArray<u8>): StaticArray<u8> {
  const message = "I'm an event!";
  generateEvent(message);
  return stringToBytes(message);
}
