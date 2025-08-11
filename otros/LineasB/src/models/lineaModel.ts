import { Schema, model, Document } from 'mongoose';
import { Linea } from '../types/linea';

interface LineaDocument extends Omit<Linea, "id">, Document {}

const lineaSchema = new Schema<LineaDocument>({
    numero: { type: Number, required: true, min: 10, max: 12 },
    cuentaPadre: { type: Number, required: true, min: 6, max: 10},
    cuentaHija: { type: Number, required: true, min: 6, max: 10 },
    status: { type: String, required: true, trim: true }
}, 
{
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = (ret._id as any).toString();
            delete ret._id;
            return ret;
        }
    }
});

export const LineaModel = model<LineaDocument>('Linea', lineaSchema);