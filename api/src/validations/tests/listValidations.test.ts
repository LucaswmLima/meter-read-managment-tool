import { describe, it, expect } from 'vitest';
import { validateMeasureType, validateCustomerCode, validateMeasuresFound } from '../listValidations'; // Ajuste o caminho conforme necessário

describe('Validation Functions', () => {
  // Teste para validateMeasureType
  describe('validateMeasureType', () => {
    it('should return valid for a valid measure type', () => {
      const result = validateMeasureType('WATER');
      expect(result).toEqual({ valid: true });
    });

    it('should return invalid for an invalid measure type', () => {
      const result = validateMeasureType('INVALID');
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    });

    it('should return valid for measure type in different case', () => {
      const result = validateMeasureType('gas');
      expect(result).toEqual({ valid: true });
    });
  });

  // Teste para validateCustomerCode
  describe('validateCustomerCode', () => {
    it('should return valid for a non-empty string', () => {
      const result = validateCustomerCode('12345');
      expect(result).toEqual({ valid: true });
    });

    it('should return invalid for an empty string', () => {
      const result = validateCustomerCode('');
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_CUSTOMER_CODE',
        error_description: 'O campo \'customer_code\' é obrigatório e deve ser uma string não vazia',
      });
    });

    it('should return invalid for a non-string value', () => {
      const result = validateCustomerCode(12345 as any);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_CUSTOMER_CODE',
        error_description: 'O campo \'customer_code\' é obrigatório e deve ser uma string não vazia',
      });
    });
  });

  // Teste para validateMeasuresFound
  describe('validateMeasuresFound', () => {
    it('should return valid for non-empty measures array', () => {
      const result = validateMeasuresFound([1, 2, 3]);
      expect(result).toEqual({ valid: true });
    });

    it('should return invalid for an empty measures array', () => {
      const result = validateMeasuresFound([]);
      expect(result).toEqual({
        valid: false,
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    });

    it('should return invalid for a null value', () => {
      const result = validateMeasuresFound(null as any);
      expect(result).toEqual({
        valid: false,
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    });
  });
});
