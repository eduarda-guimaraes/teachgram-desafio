export const convertImageToBase64AndSave = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const key = `local-img-${Date.now()}`;
      try {
        localStorage.setItem(key, base64String);
        resolve(key);
      } catch (e) {
        console.error("Local storage limit exceeded or error saving image", e);
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getImageUrl = (urlOrKey?: string): string => {
  if (!urlOrKey) return '';
  if (urlOrKey.startsWith('local-img-')) {
    return localStorage.getItem(urlOrKey) || '';
  }
  return urlOrKey;
};
