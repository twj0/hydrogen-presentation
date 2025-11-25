import { GoogleGenAI, Modality } from "@google/genai";
import { ChatMessage } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to decode Base64 to ArrayBuffer (for internal use if needed) or just use raw strings
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Chat with Gemini Pro
 */
export const sendChatMessage = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    
    // Construct the prompt with history context manually for stateless single-turn or simple accumulation
    // or use the chat API. Let's use the chat API for better context management.
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: "You are an expert professor in renewable energy, specializing in hydrogen production technologies. You are assisting a student or audience member during a presentation about 'Hydrogen Production: Industrial and Academic Frontiers'. Answer questions concisely and accurately based on current academic and industrial knowledge.",
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error connecting to the AI.";
  }
};

/**
 * Analyze Image with Gemini Pro Vision
 */
export const analyzeImage = async (file: File): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    const imagePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
            imagePart,
            { text: "Analyze this image in the context of renewable energy and hydrogen production. Explain what technical diagrams, chemical reactions, or industrial equipment are shown." }
        ]
      }
    });

    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Vision Error:", error);
    return "Error analyzing image.";
  }
};

/**
 * Text to Speech
 */
export const generateSpeech = async (text: string, audioContext: AudioContext): Promise<AudioBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    // Decode Audio
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Manual PCM Decode
    const decodePCM = (data: Uint8Array, ctx: AudioContext, sampleRate: number = 24000, numChannels: number = 1): AudioBuffer => {
      const byteLength = data.byteLength;
      // Ensure we align to 2 bytes for Int16
      const adjLength = byteLength % 2 === 0 ? byteLength : byteLength - 1;
      const dataInt16 = new Int16Array(data.buffer, data.byteOffset, adjLength / 2);
      
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    
      for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
      }
      return buffer;
    }

    return decodePCM(bytes, audioContext, 24000, 1);

  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};