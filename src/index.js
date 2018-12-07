import ipfsClient from 'ipfs-http-client';
import streamBuffers from 'stream-buffers';
import $rdf from 'rdflib';
import SolidAuthing from 'solid-authing';

class SolidIPFS {

  constructor(options) {
    this.ipfsClient = ipfsClient;
    this.$rdf = $rdf;

    this.ipfs = this.ipfsClient('127.0.0.1', '5001', { protocol: 'http' });
    this.solidAuthing = new SolidAuthing({
      clientId: '5b66984419915500015f1371',
      secret: 'a153e760bf333da7342cf83e18b1d26f',
    });

    this.options = options;
    // https://alicea.solid.authing.cn/inbox/
  }

  async getAuthingInsatance() {
    this.solidAuth = await this.solidAuthing.getAuthingInsatance(); //必须调用
  }

  async storeHash(options) {

    if (!options.hash) {
      throw "请提供 hash 值";
    }

    if (!this.options.webId) {
      throw "请提供 WebId";
    }

    await this.solidAuth.login();

    const link = '<http://www.w3.org/ns/ldp#Resource>; rel="type"';
    const storeResult = await this.solidAuth.solid.fetch(options.webId, {
      method : 'POST',
      headers : {
        'Content-Type': 'text/plain',
        slug: 'hash',
        link,
      },
      body: hash,
    });

    return storeResult;
  }

  uploadFilesToIPFS(fileArrayBuffer) {
    return new Promise((resolve) => {
      // 创建 IPFS 读写文件的流，这是一个 Duplex 流，可读可写
      this.stream = this.ipfs.addReadableStream();
      // 文件上传完毕后 resolve 这个 Promise
      this.stream.on('data', (file) => resolve(file));

      const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
        chunkSize: 25000, // 决定了传输速率
      });
      myReadableStreamBuffer.on('data', (chunk) => {
        myReadableStreamBuffer.resume();
      });                    

      // 对接好两个流，并开始上传
      this.stream.write(myReadableStreamBuffer);
      myReadableStreamBuffer.put(Buffer.from(fileArrayBuffer));

      // 上传完毕后关闭流
      myReadableStreamBuffer.on('end', () => this.stream.end());
      myReadableStreamBuffer.stop();
    });
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = event => resolve(this.uploadIPFS(event.target.result));
      fileReader.onerror = reject;
      fileReader['readAsArrayBuffer'](file);
    });
  }  
}

export default SolidIPFS;