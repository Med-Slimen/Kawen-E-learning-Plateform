import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cloudinary {
  private CLOUD_NAME = 'dtz3cpe37';
  async uploadImage(file: File,uploadPreset : string,contentType: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/${contentType}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    if (!res.ok) {
      throw new Error('upload failed');
    }
    const data = await res.json();
    return data.secure_url;
  }
}
