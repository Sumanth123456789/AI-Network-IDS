
import { GoogleGenAI, Type } from "@google/genai";
import { NetworkPacket } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeThreats = async (packets: NetworkPacket[]): Promise<NetworkPacket[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these network packets for potential security threats. 
      For each packet, provide a refined risk_score (0-100) and a brief 1-sentence analysis explaining why it is a threat or why it is safe.
      Packets: ${JSON.stringify(packets)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              risk_score: { type: Type.NUMBER },
              analysis: { type: Type.STRING },
            },
            required: ["id", "risk_score", "analysis"]
          }
        }
      }
    });

    const analysisResults = JSON.parse(response.text);
    
    return packets.map(p => {
      const analysis = analysisResults.find((a: any) => a.id === p.id);
      return analysis ? { ...p, risk_score: analysis.risk_score, analysis: analysis.analysis } : p;
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return packets;
  }
};
