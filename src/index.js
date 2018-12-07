import $rdf from 'rdflib';
import SolidAuthing from 'solid-authing';
import SolidFileClient from './solid-file-client.js';
import solid from 'solid-auth-client';

var SolidIPFS = function(options) {
  this.$rdf = $rdf;
  this.options = options;
  this.solidAuthing = null;

  if (this.options.clientId && this.options.secret) {
    this.solidAuthing = new SolidAuthing({
      clientId: options.clientId,
      secret: options.secret,
    });  
  }

  this.fileClient = new SolidFileClient();

  this.IPFSFolderName = 'ipfs';
  this.IPFSHashFolderName = 'hash';

  this.IPFSTopFolder = `${this.options.inboxUrl}${this.IPFSFolderName}/`;
  this.IPFSHashFolder = `${this.IPFSTopFolder}${this.IPFSHashFolderName}/`;
}

SolidIPFS.prototype = {

  async getAuthingInsatance() {
    if (this.solidAuthing) {
      this.solidAuth = await this.solidAuthing.getAuthingInsatance(); //必须调用
    } else {
      this.solidAuth = solid;
    }
  },

  async checkIPFSFolderExists(folderName) {
    const exists = await this.fileClient.readFolder(folderName);
    return exists;
  },

  async createIPFSFolder() {
    const topFolderExists = await this.checkIPFSFolderExists(this.IPFSTopFolder);
    const hashFolderExists = await this.checkIPFSFolderExists(this.IPFSHashFolder);

    if (topFolderExists && hashFolderExists) {
        return true;
    }

    if (!topFolderExists) {
        const topFolderCreateResult = await this.fileClient.createFolder(this.IPFSTopFolder);
        if (!topFolderCreateResult) {
            return false;
        } else {
            const hashFolderCreateResult = await this.fileClient.createFolder(this.IPFSHashFolder);
            return hashFolderCreateResult;
        }
    } else {
        if (hashFolderExists) {
            return true;
        } else {
            const hashFolderCreateResult = await this.fileClient.createFolder(this.IPFSHashFolder);
            return hashFolderCreateResult;
        }
    }
  },

  async storeHash(options) {

    if (!options.hash) {
      throw "请提供 hash 值";
    }

    if (!this.options.inboxUrl) {
      throw "请提供 inboxUrl";
    }

    await this.solidAuth.login();

    const exists = await this.checkIPFSFolderExists();
    let createFileResult = null;

    if (exists) {
        createFileResult = await this.fileClient.createFile(`${this.IPFSHashFolder}${options.hash}.txt`, 'text/plain', options.hash);
    } else {
        const createResult = await this.createIPFSFolder();
        if (createResult) {
            createFileResult = await this.fileClient.createFile(`${this.IPFSHashFolder}${options.hash}.txt`, 'text/plain', options.hash);
        } else {
            return false;
        }
    }

    return createFileResult;
  },
}

if (typeof window === 'object') {
	window.SolidIPFS = SolidIPFS;
}

export default SolidIPFS;