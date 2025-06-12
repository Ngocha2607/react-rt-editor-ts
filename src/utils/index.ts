import { Editor } from '@tiptap/react';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export interface Canceler {
  (message?: string): void;
}

export interface Cancel {
  message: string | undefined;
}
export interface CancelTokenStatic {
  new (executor: (cancel: Canceler) => void): CancelToken;
  source(): CancelTokenSource;
}

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

export interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}
export interface ResponsePreUploadParams {
  content_type: string;
  name: string;
  location: string;
  size: string;
  source: CancelTokenSource;
  display_name: string;
  parent_id?: string;
  is_public?: boolean;
  is_grading?: boolean;
}
/**
 * Checks if a mark exists in the editor schema
 *
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 */
export const isMarkInSchema = (markName: string, editor: Editor | null) =>
  editor?.schema.spec.marks.get(markName) !== undefined;

/**
 * Checks if a node exists in the editor schema
 *
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 */
export const isNodeInSchema = (nodeName: string, editor: Editor | null) =>
  editor?.schema.spec.nodes.get(nodeName) !== undefined;

// Hàm chuyển file thành base64
function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a File to base64 string
 */
export const convertFileToBase64 = (
  file: File,
  abortSignal?: AbortSignal,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const abortHandler = () => {
      reader.abort();
      reject(new Error('Upload cancelled'));
    };

    if (abortSignal) {
      abortSignal.addEventListener('abort', abortHandler);
    }

    reader.onloadend = () => {
      if (abortSignal) {
        abortSignal.removeEventListener('abort', abortHandler);
      }

      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert File to base64'));
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
export const generateUUID = (): string => {
  // Polyfill thuần v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
