// proxy.ts

import {
    Address,
    Context,
    generateEvent,
    localCall,
    print,
  } from '@massalabs/massa-as-sdk';
  import { Args, Result, Serializable, stringToBytes } from '@massalabs/as-types';
  
  let generatedEvents: string[] = [];
  
  export function getGeneratedEvents(): string[] {
    return generatedEvents;
  }
  
  function captureEvent(message: string): void {
    generatedEvents.push(message);
  }
  
  export function constructor(binaryArgs: StaticArray<u8>): StaticArray<u8> {
    if (!Context.isDeployingContract()) {
      return [];
    }
  
    const argsDeser = new Args(binaryArgs);
    const name = argsDeser
      .nextString()
      .expect('Name argument is missing or invalid');
  
    const eventMessage = `Constructor called with name ${name}`;
    captureEvent(eventMessage);
  
    return [];
  }
  
  export function _delegate(binaryArgs: StaticArray<u8>): void {
    const argsDeser = new Args(binaryArgs);
  
    const address = argsDeser.nextString().expect('Address is required');
  
    const functionName = argsDeser
      .nextString()
      .expect('functionName is required');
  
    // Assuming `args` is an array of values to pass to the functionß
    const argsBytes: StaticArray<u8> = argsDeser
      .nextBytes()
      .expect('args are required');
  
    // Assuming `localCall` returns a result
    const result = localCall(
      new Address(address),
      functionName,
      new Args().add(argsBytes),
    );
    const eventMessage = `Call to ${address}.${functionName} returned ${result}`;
    generateEvent(eventMessage);
    captureEvent(eventMessage);
  }
  