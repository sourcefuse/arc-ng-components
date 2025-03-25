import { Injectable } from "@angular/core";
import { DownloadAIFile } from "../commands";
import { ApiService } from "../services";
import { AnyAdapter } from "../adapters";

@Injectable()
export class DeepChatFacadeService {
  constructor(
    private readonly apiService: ApiService,
    private readonly anyAdapter: AnyAdapter,
  ) {}

downloadAIFile(fileKey: string, url: string) {
    const command = new DownloadAIFile(
      this.apiService,
      this.anyAdapter,
      url,
      fileKey,
    );

    command.parameters = {
      responseType: 'blob',
    };
    return command.execute();
  }
}