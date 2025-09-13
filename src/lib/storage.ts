// Local storage service
export class StorageService {
  private static readonly PREFIX = "etech_";

  static set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serializedValue);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error saving to localStorage:", error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error removing from localStorage:", error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error clearing localStorage:", error);
    }
  }

  static exists(key: string): boolean {
    return localStorage.getItem(this.PREFIX + key) !== null;
  }
}

export const storageService = new StorageService();
