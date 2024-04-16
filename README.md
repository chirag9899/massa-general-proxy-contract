# Massa Proxy Contract


## Overview

The Massa Proxy Contract acts as a general proxy on the Massa blockchain, designed to manage and forward interactions to other smart contracts. It provides functionalities such as data storage and delegated function execution. This proxy setup is especially beneficial for managing upgrades to contract logic seamlessly without changing their deployed addresses.


### Installation

To deploy the Massa Proxy Contract, you will need to have the Massa node installed on your system and be familiar with smart contract deployment on the Massa blockchain.

- Clone the repository:

```sh
git clone <repository-url>
cd <repository-directory>
```

- Install dependencies:
```sh
npm install
```

- Compile the contract:
```sh
npm run build
```

## Deployment

- Deploying the proxy contract involves initializing it with the address of the implementation contract.
Use the steps below to deploy the proxy:

- Prepare Constructor Arguments
The constructor requires the binary-encoded address of the implementation contract. Ensure this is prepared and encoded correctly as StaticArray<u8>.

  
```typescript
constructor(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  if (!Context.isDeployingContract()) {
    return [];
  }

  const argsDeser = new Args(binaryArgs);
  const implementationAddress = argsDeser
    .nextString()
    .expect('implementationAddress argument is missing or invalid');

  Storage.set(ADMIN_ADDRESS_SLOT, Context.caller().toString());
  Storage.set(IMPLEMENTATION_ADDRESS_SLOT, implementationAddress);
  Storage.set(REENTRANCY_LOCK_SLOT, '0');
  Storage.set(PAUSE_SLOT, '0');


  const eventMessage = `Constructor called with name ${implementationAddress} by ${Context.caller().toString()}`;
  logEvent(eventMessage);

  return [];
}
```
## Contract Management
After deployment, the proxy contract supports various management and operational functions such as updating the admin address, pausing/unpausing the contract, and delegating calls to the implementation contract.

### Delegate Calls

```typescript
function delegateCall(binaryArgs: StaticArray<u8>): void {}
```
- The delegateCall function forwards function calls along with their arguments to the implementation contract specified by the proxy. Use this function to interact with the underlying contract's methods.


### Update Admin Address

```typescript
function updateAdminAddress(binaryArgs: StaticArray<u8>): StaticArray<u8> {}
```
- Admins can update the administrative address of the contract using the updateAdminAddress function.

### Change Implementation Contract Address

```typescript
function setImplementation(binaryArgs: StaticArray<u8>): StaticArray<u8> {}
```
- Admin can update the implementation contract address of the contract using the setImplementation function.

### Pause and Unpause

- Admins have the capability to pause and unpause the contract to manage the accessibility of its functions during critical operations or maintenance periods.

<br> <br>

# Contract Wrapping

- Included is a WrapperProxy class to simplify interactions with the proxy contract through a standard interface, handling all necessary argument serialization and deserialization for ease of use.

```typescript
export class WrapperProxy {
    private _origin: Address;

    constructor(at: Address) {
        this._origin = at;
    }

    init(implementationAddress: string): void {
        // Assuming constructor only needs implementation address
        const args = new Args().add(implementationAddress);
        call(this._origin, 'constructor', args, 0);
    }

    updateAdminAddress(newAdminAddress: StaticArray<u8>): StaticArray<u8> {
        const args = new Args().add(newAdminAddress);
        return call(this._origin, 'updateAdminAddress', args, 0);
    }

    setImplementation(newImplementationAddress: StaticArray<u8>): StaticArray<u8> {
        const args = new Args().add(newImplementationAddress);
       return call(this._origin, 'setImplementation', args, 0);
    }

    getAdmin(): StaticArray<u8> {
        return call(this._origin, 'getAdmin', NoArg, 0);
    }

    getImplementationAddress(): StaticArray<u8> {
        return call(this._origin, 'getImplementationAddress', NoArg, 0);
    }

    delegateCall( args: StaticArray<u8>): void {
        call(this._origin, 'delegateCall', new Args().add(args), 0);
    }

}
```
  
