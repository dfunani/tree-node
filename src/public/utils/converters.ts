export async function handleImageConversion(file: File | Blob): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read as data URL for base64 encoding
  
      reader.onload = () => {
        const base64String = reader.result as string; // Ensure result type
        resolve(base64String.split(',')[1]); // Extract base64 data from data URL
      };
  
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error); // Reject the promise with error
      };
    });
  }