import { Request, Response } from "express";
import { uploadToLocalStorage } from "../services/storageService";
import Measure from "../models/MeasureModel";
import { processMeterImage } from "../services/geminiService";
import {
  validateRequiredFields,
  validateBase64Image,
  validateMeasureType,
  validateDateFormat,
  validateDuplicateReading,
  validateCustomerCode,
} from "../validations/addValidations";
import { generateUUID } from "../utils/helpers";

export const create = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime } = req.body;
    let { measure_type } = req.body;
    measure_type = measure_type.toUpperCase();

    // Valida se todos os campos estão sendo enviados
    let validationResult = validateRequiredFields(
      image,
      customer_code,
      measure_datetime,
      measure_type
    );
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Valida o formato base64 da imagem
    validationResult = validateBase64Image(image);
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Valida o campo customer_code
    validationResult = validateCustomerCode(customer_code);
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Valida o tipo de medição
    validationResult = validateMeasureType(measure_type);
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Valida o formato da data
    validationResult = validateDateFormat(measure_datetime);
    if (!validationResult.valid) return res.status(400).json(validationResult);

    // Valida se a leitura já foi feita no mes
    validationResult = await validateDuplicateReading(customer_code, measure_type, new Date(measure_datetime));
    if (!validationResult.valid) return res.status(409).json(validationResult);

    // Processa a imagem no serviço do Google
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    let measure_value;
    try {
      measure_value = await processMeterImage(base64Data);
    } catch (err) {
      console.error("Erro ao processar a imagem:", err);
      return res.status(500).json({
        error_code: "IMAGE_PROCESSING_ERROR",
        error_description: "Erro ao processar a imagem.",
      });
    }

    // Faz upload da imagem no serviço de storage local e gera o link
    const imageUrl = uploadToLocalStorage(base64Data, "image/jpeg"); // Define o tipo de conteúdo conforme necessário

    // Cria a picture que irá ser salva
    const measure = new Measure({
      image_url: imageUrl,
      customer_code,
      measure_datetime,
      measure_type,
      measure_uuid: generateUUID(),
      measure_value,
    });

    // Salva no banco
    await measure.save();

    // Resposta caso tudo ocorra bem
    res.status(200).json({
      image_url: imageUrl,
      measure_value: parseInt(measure_value, 10),
      measure_uuid: measure.measure_uuid,
    });
  } catch (error) {
    return res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a requisição",
    });
  }
};
