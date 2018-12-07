# solid-ipfs

Using [Solid](https://solid.inrupt.com) to store [IPFS](https://ipfs.io) Hash privately or publicly.

## Install

```shell
$ npm install solid-ipfs --save
```

## Usage

```javascript
import SolidIPFS from 'solid-ipfs';

const main = async () => {
    const solidIpfs = new SolidIPFS({
        url: 'YOUR_SOLID_URL', // e.g. https://alicea.solid.authing.cn/inbox/
    });

    const result = await solidIpfs.storeHash({
        hash: 'YOUR_IPFS_HASH',
    });

    console.log(result, result ? '保存成功' : '保存失败');
}

main();
```

Then you can get IPFS hash list via `<YOURL_SOLID_URL>/ipfs/hash/`.

If you don't have a solid account, please click [here](https://solid.authing.cn) to register

In Solid, the path with the suffix `inbox` is a private data storage area. Others are `public` and `profile`, all publicly accessible. So if you want to privatize the store, use `inbox` , otherwise you can choose `public` or `profile`.

### Private path example

1. [https://alicea.solid.authing.cn/inbox/](https://alicea.solid.authing.cn/inbox/)

```javascript
import SolidIPFS from 'solid-ipfs';

const main = async () => {
    const solidIpfs = new SolidIPFS({
        url: 'https://alicea.solid.authing.cn/inbox/', // inbox -> private
    });

    const result = await solidIpfs.storeHash({
        hash: 'YOUR_IPFS_HASH',
    });

    console.log(result, result ? '保存成功' : '保存失败');
}

main();
```

### Public path example

1. [https://alicea.solid.authing.cn/profile/](https://alicea.solid.authing.cn/profile/)
2. [https://alicea.solid.authing.cn/public/](https://alicea.solid.authing.cn/public/)

```javascript
import SolidIPFS from 'solid-ipfs';

const main = async () => {
    const solidIpfs = new SolidIPFS({
        url: 'https://alicea.solid.authing.cn/public/', // public -> public
    });

    const result = await solidIpfs.storeHash({
        hash: 'YOUR_IPFS_HASH',
    });

    console.log(result, result ? '保存成功' : '保存失败');
}

main();
```

## Using with [Authing](https://authing.cn)

[Authing](https://authing.cn) is an identity for EVERYONE and EVERYTHING, which likes Auth0.

We have integrated authing so that you can see statistics in the Authing dashboard after logging in/registering solid.

```javascript
import SolidIPFS from 'solid-ipfs';

const main = async () => {
    const solidIpfs = new SolidIPFS({
        url: 'https://alicea.solid.authing.cn/inbox/', // inbox -> private
        clientId: '<YOUR_AUTHING_CLIENT_ID>',
        secret: '<YOUR_AUTHING_CLIENT_SECRET>',
    });

    await solidIpfs.initInstance(); // MUST

    const result = await solidIpfs.storeHash({
        hash: 'YOUR_IPFS_HASH',
    });

    console.log(result, result ? '保存成功' : '保存失败');
}

main();
```
