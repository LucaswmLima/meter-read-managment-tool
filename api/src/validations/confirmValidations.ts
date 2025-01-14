import { IMeasure } from "../interfaces/measure";

export const validateRequestData = (
  measure_uuid: any,
  confirmed_value: any
) => {
  // Mensagens de erro específicas
  const errors: string[] = [];

  // Verifica se measure_uuid está presente e é uma string não vazia
  if (measure_uuid === undefined || measure_uuid === null) {
    errors.push("O campo 'measure_uuid' é obrigatório.");
  } else if (typeof measure_uuid !== "string") {
    errors.push("O campo 'measure_uuid' deve ser uma string.");
  } else if (measure_uuid.trim() === "") {
    errors.push("O campo 'measure_uuid' não pode estar vazio.");
  }

  // Verifica se confirmed_value está presente e é um número válido
  if (confirmed_value === undefined || confirmed_value === null) {
    errors.push("O campo 'confirmed_value' é obrigatório.");
  } else if (typeof confirmed_value !== "number" || isNaN(confirmed_value)) {
    errors.push("O campo 'confirmed_value' deve ser um número inteiro.");
  }

  // Retorna o resultado da validação
  if (errors.length > 0) {
    return {
      valid: false,
      error_code: "INVALID_DATA",
      error_description: `Dados fornecidos no corpo da requisição são inválidos: ${errors.join(' ')}`,
    };
  }

  return { valid: true };
};
export const checkConfirmationStatus = (measure: IMeasure) => {
  if (measure.has_confirmed) {
    return {
      valid: false,
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura do mês já realizada.",
    };
  }
  return { valid: true };
};
