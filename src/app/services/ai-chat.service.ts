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

  async* getStreamedResponse(prompt: string): AsyncGenerator<string> {
    const result = streamText({
       model: this.openrouter('meta-llama/llama-3.3-70b-instruct:free'),
      // model: this.openrouter('google/gemini-2.0-flash-exp:free'),
      // model: this.openrouter('thudm/glm-z1-9b:free'),
      // model: this.openrouter('microsoft/mai-ds-r1:free'),
      prompt,
      // system: '',
      //temperature: 0
    })

    for await (const chunk of result.textStream) {
      console.log('chunk: ', chunk);
      yield chunk
    }
  }

}
