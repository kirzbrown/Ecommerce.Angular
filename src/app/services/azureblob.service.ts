import { Injectable } from "@angular/core";
import {
    BlobServiceClient,
  } from "@azure/storage-blob";
  import { BlobItem } from '@azure/storage-blob';
  import { environment } from "src/environments/environment";
  const account = environment.azurestorage.accountName;
  const accountKey = environment.azurestorage.sasToken;
   const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${accountKey}`);

  export interface BLOBItem extends BlobItem { };
export interface CONTENT {
  containerName: string; // desired container name
  file: any;  // file to upload
  filename: string; // filename as desired with path
}

@Injectable({
    providedIn: 'root'
  })


export class AzureBlobStorageService {
  public tempFileStorageUri = `https://ecommercephstorageaccount.blob.core.windows.net/${environment.azurestorage.tempBlobContainer}/`

    constructor() { }

     async listBlob(containerName: string) {
        // BlobContainerClient
        const containerClient = blobServiceClient.getContainerClient(containerName);
        let ListBlobs = [];
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
          ListBlobs.push(blobItem.value);
          blobItem = await iter.next();
        }
        console.info("ListBlobs")
        // console.log(ListBlobs)
        return ListBlobs;
      }

      async uploadFile(content: CONTENT) {
        const containerClient = blobServiceClient.getContainerClient(content.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(content.filename);
        const uploadBlobResponse = await blockBlobClient.uploadBrowserData(content.file, {
          maxSingleShotSize: 4 * 1024 * 1024,
          blobHTTPHeaders: { blobContentType: content.file.type } // set mimetype
        });
      
        // console.log("uploadBlobResponse")
        // console.log(uploadBlobResponse)
        return `Upload block blob ${content.filename} successfully ${uploadBlobResponse.requestId}`;
      }

      async uploadMultipleFiles(contents: CONTENT[]) {
        for await(let content of contents){
          const containerClient = blobServiceClient.getContainerClient(content.containerName);
          const blockBlobClient = containerClient.getBlockBlobClient(content.filename);
          const uploadBlobResponse = blockBlobClient.uploadBrowserData(content.file, {
            maxSingleShotSize: 4 * 1024 * 1024,
            blobHTTPHeaders: { blobContentType: content.file.type } // set mimetype
          });
        }

        return `Upload block blobs successfully`;
      }

      async deleteBlob(content: CONTENT){
        const containerClient = blobServiceClient.getContainerClient(content.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(content.filename);
        const deleteBlob = await blockBlobClient.deleteIfExists();
        return `Deleted Blob ${content.filename} successfully ${deleteBlob.requestId}`;
      }
}