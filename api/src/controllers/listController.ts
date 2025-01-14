import { Request, Response } from "express";
import Picture from "../models/MeasureModel";
import {
  validateMeasureType,
  validateCustomerCode,
  validateMeasuresFound,
} from "../validations/listValidations";

export const list = async (req: Request, res: Response) => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    // Query para a busca
    const query: any = { customer_code };

    // Valida o campo customer_code
    let validationResult = validateCustomerCode(customer_code);
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Valida o campo measure_type
    validationResult = validateMeasureType(measure_type);
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Verifica se tem o parametro opcional WATER ou GAS pra adicionar na query
    if (measure_type) {
      query.measure_type = (measure_type as string).toUpperCase();
    }

    // Busca das medições no banco de dados
    const measures = await Picture.find(query).select(
      "measure_uuid measure_value measure_datetime measure_type has_confirmed image_url"
    );

    // Verifica se encontrou medições
    validationResult = validateMeasuresFound(measures);
    if (!validationResult.valid) return res.status(404).json(validationResult);

    // Responde com a lista de medições caso tudo ocorra bem
    return res.status(200).json({
      customer_code,
      measures: measures.map((measure) => ({
        measure_uuid: measure.measure_uuid,
        measure_value: measure.measure_value,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
      })),
    });
  } catch (error) {
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a requisição",
    });
  }
};
