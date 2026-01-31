import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";



function withTimeout(promise, ms = 60000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), ms)
    ),
  ]);
}

/**
 * @param {File} file
 * @param {string} folder
 * @param {(pct:number)=>void} onProgress
 * @returns {Promise<string>} downloadURL
 */
export async function uploadImage(file, folder = "products", onProgress) {
    console.log("UPLOAD: start", file.name, file.size);
  if (!file) throw new Error("No file");

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  const task = uploadBytesResumable(storageRef, file);

  const url = await withTimeout(
    new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          console.log("UPLOAD progress:", pct);
          if (onProgress) onProgress(pct);
          
        },
        (err) => {
            console.error("UPLOAD error:", err);
            reject(err)},
    
        async () => {
             console.log("UPLOAD finished, getting URL...");
            resolve(await getDownloadURL(task.snapshot.ref))}
      );
    }),
    90000 // 90s таймаут на одне фото
  );

  return url;
}
