import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const uploadToLocalStorage = (base64Data: string, mimeType: string): string => {
  try {
    // Remove o prefixo
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64String, 'base64');
    const fileName = `${uuidv4()}.${mimeType.split('/')[1]}`;
    const uploadDirectory = path.join(__dirname, '..', 'public', 'uploads');
    const filePath = path.join(uploadDirectory, fileName);

    // Cria o diretório se não existir
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    // Salva o arquivo
    fs.writeFileSync(filePath, buffer);

    return `/uploads/${fileName}`; // URL para acessar
  } catch (error) {
    console.error('Erro ao salvar o arquivo:', error);
    throw error; // Re-lança o erro para que possa ser tratado em outro lugar
  }
};
