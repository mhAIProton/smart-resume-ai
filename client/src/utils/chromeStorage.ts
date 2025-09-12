// Utility functions for Chrome storage API
// Falls back to localStorage if not in Chrome extension context

export interface ChromeStorage {
  get: (keys: string | string[] | object) => Promise<any>;
  set: (items: object) => Promise<void>;
  remove: (keys: string | string[]) => Promise<void>;
  clear: () => Promise<void>;
}

// Check if we're in a Chrome extension context
const isChromeExtension = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome?.storage?.local;
};

// Get Chrome storage API or fallback to localStorage
const getStorage = (): ChromeStorage => {
  if (isChromeExtension()) {
    return {
      get: (keys: string | string[] | object) => {
        return new Promise((resolve) => {
          chrome.storage.local.get(keys, (result) => {
            resolve(result);
          });
        });
      },
      set: (items: object) => {
        return new Promise((resolve) => {
          chrome.storage.local.set(items, () => {
            resolve();
          });
        });
      },
      remove: (keys: string | string[]) => {
        return new Promise((resolve) => {
          chrome.storage.local.remove(keys, () => {
            resolve();
          });
        });
      },
      clear: () => {
        return new Promise((resolve) => {
          chrome.storage.local.clear(() => {
            resolve();
          });
        });
      }
    };
  } else {
    // Fallback to localStorage for development
    return {
      get: (keys: string | string[] | object) => {
        if (typeof keys === 'string') {
          const value = localStorage.getItem(keys);
          return Promise.resolve({ [keys]: value ? JSON.parse(value) : null });
        } else if (Array.isArray(keys)) {
          const result: any = {};
          keys.forEach(key => {
            const value = localStorage.getItem(key);
            result[key] = value ? JSON.parse(value) : null;
          });
          return Promise.resolve(result);
        } else {
          const result: any = {};
          Object.keys(keys).forEach(key => {
            const value = localStorage.getItem(key);
            result[key] = value ? JSON.parse(value) : null;
          });
          return Promise.resolve(result);
        }
      },
      set: (items: object) => {
        Object.entries(items).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        return Promise.resolve();
      },
      remove: (keys: string | string[]) => {
        const keysArray = Array.isArray(keys) ? keys : [keys];
        keysArray.forEach(key => {
          localStorage.removeItem(key);
        });
        return Promise.resolve();
      },
      clear: () => {
        localStorage.clear();
        return Promise.resolve();
      }
    };
  }
};

export const storage = getStorage();

// Storage keys
export const STORAGE_KEYS = {
  JOB_DESCRIPTION: 'smart_resume_job_description',
  GENERATION_TYPE: 'smart_resume_generation_type',
  SELECTED_TONE: 'smart_resume_selected_tone',
  RESUME_DATA: 'smart_resume_resume_data',
  SELECTED_DESIGN: 'smart_resume_selected_design',
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

// Helper functions for common operations
export const saveToStorage = async (key: string, data: any): Promise<void> => {
  try {
    await storage.set({ [key]: data });
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const loadFromStorage = async (key: string): Promise<any> => {
  try {
    const result = await storage.get(key);
    return result[key] || null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await storage.remove(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await storage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
