import { db, storage } from "@/config/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

//Upload images and store images to the imageUrls
export const uploadFiles = async (files, attachments) => {
    const promises = [];

    for (const [index, file] of files.entries()) {
      const id = uuid();
      const storageRef = ref(storage, id);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const filename = file.name;

      const promise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (error) => {
            console.log("upload error: ", error);
            reject(error);
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                if (attachments) {
                  resolve({ filename: filenames[index], url: downloadURL });
                } else {
                  resolve({ downloadURL, filename });
                }
              }
            );
          }
        );
      });

      promises.push(promise);
    }

    const downloadUrls = await Promise.all(promises);
    return downloadUrls;
  };