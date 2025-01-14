import { Request, Response } from "express";
import { validateRequestData, checkConfirmationStatus } from "../validations/confirmValidations";
import Picture from "../models/MeasureModel";

export const confirm = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Armazena a busca na variável measure para validações adicionais
    const measure = await Picture.findOne({ measure_uuid });

    // Valida os dados recebidos
    let validationResult = validateRequestData(measure_uuid, confirmed_value);
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Valida se a leitura foi encontrada
    if (!measure) {
      return res.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês já realizada",
      });
    }

    // Verifica o status de confirmação da leitura
    validationResult = checkConfirmationStatus(measure);
    if (!validationResult.valid) return res.status(409).json(validationResult);

    // Atualiza o valor confirmado e marca a leitura como confirmada
    measure.measure_value = confirmed_value;
    measure.has_confirmed = true;

    // Salva as alterações no banco de dados
    await measure.save();

    // Resposta caso tudo ocorra bem
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a requisição",
    });
  }
};
