// Interface para os dados de medição
interface Measurement {
  image_url: string;
  measure_value: string;
  measure_uuid: string;
  confirmation_status: string | null;
}

export type { Measurement };
