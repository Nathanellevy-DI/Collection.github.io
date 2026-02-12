import LZString from 'lz-string';

/**
 * Compresses a string using LZ-string
 * @param {string} data - The string to compress
 * @returns {string} - The compressed string
 */
export const compressData = (data) => {
    try {
        return LZString.compressToUTF16(data);
    } catch (error) {
        console.error('Error compressing data:', error);
        return data;
    }
};

/**
 * Decompresses a string using LZ-string
 * @param {string} compressedData - The compressed string
 * @returns {string} - The decompressed string
 */
export const decompressData = (compressedData) => {
    try {
        return LZString.decompressFromUTF16(compressedData);
    } catch (error) {
        console.error('Error decompressing data:', error);
        return null;
    }
};

/**
 * Processes an image file: Resizes it and converts to base64 JPEG
 * @param {File} file - The image file
 * @param {number} maxWidth - Max width for the thumbnail (default 300px)
 * @param {number} quality - JPEG quality (0 to 1)
 * @returns {Promise<string>} - Base64 string of the processed image
 */
export const processImage = (file, maxWidth = 300, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            console.error("processImage: No file provided");
            reject('No file provided');
            return;
        }

        console.log("processImage: Starting for file", file.name, file.type, file.size);

        const reader = new FileReader();

        try {
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("processImage: Failed to read file", err);
            reject(err);
            return;
        }

        reader.onload = (event) => {
            console.log("processImage: File read successfully, loading into Image object");
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                console.log("processImage: Image loaded", img.width, "x", img.height);
                try {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 JPEG with reduced quality
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    console.log("processImage: Conversion successful, length:", dataUrl.length);
                    resolve(dataUrl);
                } catch (err) {
                    console.error("processImage: Error during canvas manipulation", err);
                    reject(err);
                }
            };

            img.onerror = (error) => {
                console.error("processImage: Image.onerror triggered", error);
                reject(new Error("Failed to load image via Image object"));
            };
        };

        reader.onerror = (error) => {
            console.error("processImage: FileReader.onerror triggered", error);
            reject(error);
        };
    });
};
