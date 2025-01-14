import mongoose, { Schema } from 'mongoose';
import { IMeasure } from '../interfaces/measure';

// Definição do Schema
const MeasureSchema: Schema<IMeasure> = new Schema({
  image_url: {
    type: String,
    required: true,
  },
  customer_code: {
    type: String,
    required: true,
  },
  measure_datetime: {
    type: Date,
    default: Date.now,
  },
  measure_type: {
    type: String,
    required: true
  },
  measure_value: {
    type: Number,
    required: true,
  },
  measure_uuid: {
    type: String,
    required: true,
    unique: true,
  },
  has_confirmed: {
    type: Boolean,
    default: false,
  },
});

const Measures = mongoose.model<IMeasure>('Measure', MeasureSchema);
export default Measures;
