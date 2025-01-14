import { v4 as uuidv4 } from 'uuid';

// Gera ID único
export const generateUUID = (): string => uuidv4();

// Encontra o começo do mes com base em um Date
export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Encontra o fim do mes com base em um Date
export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};