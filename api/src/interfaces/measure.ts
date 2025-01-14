import { Document } from 'mongoose';

export interface IMeasure extends Document {
  image_url: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: string;
  measure_uuid: string;
  has_confirmed: boolean;
  measure_value: number;
}