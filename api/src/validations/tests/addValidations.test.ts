import { describe, it, expect, vi } from 'vitest';
import { 
  validateRequiredFields, 
  validateCustomerCode, 
  validateBase64Image, 
  validateMeasureType, 
  validateDateFormat, 
  validateDuplicateReading 
} from '../addValidations';
import Measure from '../../models/MeasureModel';

// Mock simulando o Measure
vi.mock('../models/MeasureModel', () => ({
  default: {
    findOne: vi.fn(),
  }
}));


describe('addValidations', () => {

  // Testes para a função validateRequiredFields
  describe('validateRequiredFields', () => {
    it('should return invalid if any field is missing', () => {
      // Testa a validação quando algum campo obrigatório está faltando
      const result = validateRequiredFields('', 'customer_code', '2024-08-30T00:00:00Z', 'WATER');
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: 'Todos os campos são obrigatórios',
      });
    });

    it('should return valid if all fields are present', () => {
      // Testa a validação quando todos os campos obrigatórios estão presentes
      const result = validateRequiredFields('base64image', 'customer_code', '2024-08-30T00:00:00Z', 'WATER');
      expect(result).toEqual({
        valid: true,
      });
    });
  });

  // Testes para a função validateCustomerCode
  describe('validateCustomerCode', () => {
    it('should return invalid if customer_code is not a string', () => {
      // Testa a validação quando o customer_code não é uma string
      const result = validateCustomerCode(123 as any);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: "O campo 'customer_code' deve ser uma string",
      });
    });

    it('should return valid if customer_code is a string', () => {
      // Testa a validação quando o customer_code é uma string
      const result = validateCustomerCode('customer_code');
      expect(result).toEqual({
        valid: true,
      });
    });
  });

  // Testes para a função validateBase64Image
  describe('validateBase64Image', () => {
    it('should return invalid if image is not in base64 format', () => {
      // Testa a validação quando a imagem não está no formato base64
      const result = validateBase64Image('invalidformat');
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: 'Formato da imagem base64 inválido',
      });
    });

    it('should return valid if image is in base64 format', () => {
      // Testa a validação quando a imagem está no formato base64
      const result = validateBase64Image('data:image/png;base64,validbase64data');
      expect(result).toEqual({
        valid: true,
      });
    });
  });

  // Testes para a função validateMeasureType
  describe('validateMeasureType', () => {
    it('should return invalid if measure_type is not "WATER" or "GAS"', () => {
      // Testa a validação quando o tipo de medição não é "WATER" nem "GAS"
      const result = validateMeasureType('INVALID');
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: "O tipo de medição deve ser 'WATER' ou 'GAS'",
      });
    });

    it('should return valid if measure_type is "WATER" or "GAS"', () => {
      // Testa a validação quando o tipo de medição é "WATER" ou "GAS"
      const result = validateMeasureType('WATER');
      expect(result).toEqual({
        valid: true,
      });
    });
  });

  // Testes para a função validateDateFormat
  describe('validateDateFormat', () => {
    it('should return invalid if measure_datetime is not a string', () => {
      // Testa a validação quando a data e hora não é uma string
      const result = validateDateFormat(123 as any);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: "O campo 'measure_datetime' deve ser uma string representando a data e hora no formato ISO 8601",
      });
    });

    it('should return invalid if measure_datetime is an invalid date format', () => {
      // Testa a validação quando a data e hora está em um formato inválido
      const result = validateDateFormat('invalid-date');
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: "Formato de data/hora inválido",
      });
    });

    it('should return valid if measure_datetime is a valid ISO 8601 string', () => {
      // Testa a validação quando a data e hora está no formato ISO 8601 correto
      const result = validateDateFormat('2024-08-30T00:00:00Z');
      expect(result).toEqual({
        valid: true,
      });
    });
  });

  // Testes para a função validateDuplicateReading
  describe('validateDuplicateReading', () => {
    it('should return invalid if a duplicate reading exists', async () => {
      // Simula a existência de uma medição
      vi.spyOn(Measure, 'findOne').mockResolvedValueOnce({}); // Retorna um objeto para simular uma medição

      // Chama a função para verificar a leitura duplicada
      const result = await validateDuplicateReading('customer_code', 'WATER', new Date('2024-08-01T00:00:00Z'));
      expect(result).toEqual({
        valid: false,
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    });

    it('should return valid if no duplicate reading exists', async () => {
      // Simula a ausência de uma medição
      vi.spyOn(Measure, 'findOne').mockResolvedValueOnce(null); // Retorna null para simular nenhuma medição existente

      // Chama a função para verificar a leitura duplicada
      const result = await validateDuplicateReading('customer_code', 'WATER', new Date('2024-08-01T00:00:00Z'));
      expect(result).toEqual({
        valid: true,
      });
    });
  });

});
