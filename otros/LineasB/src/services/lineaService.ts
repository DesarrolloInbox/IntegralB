import { LineaModel } from "../models/lineaModel";
import { Linea } from "../types/linea";

export class LineaService {

  async getAllLineas(): Promise<Linea[]> {
    return await LineaModel.find()
  }

  async getLineaById(id: string): Promise<Linea | null> {
    return await LineaModel.findById(id);
  }

  async createLinea(lineaData: Partial<Linea>): Promise<Linea> {
    const linea = new LineaModel(lineaData);
    return await linea.save();
  }

  async updateLinea(id: string, lineaData: Partial<Linea>): Promise<Linea | null> {
    return await LineaModel.findByIdAndUpdate(id, lineaData, { new: true });
  }

  async deleteLinea(id: string): Promise<void> {
    await LineaModel.findByIdAndDelete(id);
  }
}