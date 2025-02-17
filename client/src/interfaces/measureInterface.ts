// Interface para os dados de medição
interface Measurement {
  image_url: string;
  measure_value: string;
  measure_uuid: string;
  has_confirmed: string | null;
}

export type { Measurement };
