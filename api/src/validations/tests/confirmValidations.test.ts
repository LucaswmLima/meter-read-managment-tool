import { describe, it, expect } from 'vitest';
import { validateRequestData, checkConfirmationStatus } from '../confirmValidations';

describe('Validation Functions', () => {

  describe('validateRequestData', () => {

    // Testa se a função retorna inválido quando 'measure_uuid' não é uma string
    it('should return invalid if measure_uuid is not a string', () => {
      const result = validateRequestData(123 as any, 50);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: 'Dados fornecidos no corpo da requisição são inválidos: O campo \'measure_uuid\' deve ser uma string.',
      });
    });

    // Testa se a função retorna inválido quando 'measure_uuid' é uma string vazia
    it('should return invalid if measure_uuid is an empty string', () => {
      const result = validateRequestData('', 50);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: 'Dados fornecidos no corpo da requisição são inválidos: O campo \'measure_uuid\' não pode estar vazio.',
      });
    });

    // Testa se a função retorna inválido quando 'confirmed_value' não é um número
    it('should return invalid if confirmed_value is not a number', () => {
      const result = validateRequestData('uuid123', 'string' as any);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: 'Dados fornecidos no corpo da requisição são inválidos: O campo \'confirmed_value\' deve ser um número inteiro.',
      });
    });

    // Testa se a função retorna inválido quando 'measure_uuid' está ausente
    it('should return invalid if measure_uuid is missing', () => {
      const result = validateRequestData(null as any, 50);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: 'Dados fornecidos no corpo da requisição são inválidos: O campo \'measure_uuid\' é obrigatório.',
      });
    });

    // Testa se a função retorna inválido quando 'confirmed_value' está ausente
    it('should return invalid if confirmed_value is missing', () => {
      const result = validateRequestData('uuid123', null as any);
      expect(result).toEqual({
        valid: false,
        error_code: 'INVALID_DATA',
        error_description: 'Dados fornecidos no corpo da requisição são inválidos: O campo \'confirmed_value\' é obrigatório.',
      });
    });

    // Testa se a função retorna válido quando todos os campos estão corretos
    it('should return valid if all fields are correct', () => {
      const result = validateRequestData('uuid123', 50);
      expect(result).toEqual({
        valid: true,
      });
    });
  });

  describe('checkConfirmationStatus', () => {

    // Testa se a função retorna inválido quando 'measure.has_confirmed' é verdadeiro
    it('should return invalid if measure.has_confirmed is true', () => {
      const measure = { has_confirmed: true } as any;
      const result = checkConfirmationStatus(measure);
      expect(result).toEqual({
        valid: false,
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada.',
      });
    });

    // Testa se a função retorna válido quando 'measure.has_confirmed' é falso
    it('should return valid if measure.has_confirmed is false', () => {
      const measure = { has_confirmed: false } as any;
      const result = checkConfirmationStatus(measure);
      expect(result).toEqual({
        valid: true,
      });
    });
  });

});
