import { Injectable } from '@angular/core';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {

  constructor() { }

  openrouter = createOpenRouter({
    apiKey: environment.openRouterKey,

  });

  async* getStreamedResponse(prompt: string, model: string): AsyncGenerator<string> {
    try{
      const result = streamText({
        model: this.openrouter(model),
        //model: this.openrouter('meta-llama/llama-3.3-70b-instruct:free'),
        // model: this.openrouter('google/gemini-2.0-flash-exp:free'),
        // model: this.openrouter('thudm/glm-z1-9b:free'),
        // model: this.openrouter('microsoft/mai-ds-r1:free'),
        prompt,
        // system: '',
        //temperature: 0
      }) as any;

      const { finishReasonPromise, textPromise } = result;

      const finishReason = await finishReasonPromise;
      const textResult = await textPromise;

      if (finishReason === 'error' || !textResult) {
        const error = new Error('RATE_LIMIT_EXCEEDED');
        throw error;
      }

      let hasReceivedData = false;

      for await (const chunk of result.textStream) {
        hasReceivedData = true;
        yield chunk
      }

      if (!hasReceivedData) {
        // Nunca recibimos ningún chunk = error "silencioso"
        throw new Error('NO_RESPONSE');
      }
    } catch (error: any) {

      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        throw error;
      }

      if (error.message === 'NO_RESPONSE') {
        throw error;
      }

      throw new Error('UNEXPECTED_ERROR');
    }
  }

}
