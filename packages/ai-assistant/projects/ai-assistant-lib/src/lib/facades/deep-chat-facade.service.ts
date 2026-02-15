import { Injectable } from "@angular/core";
import { DeleteFeedbackCommand, DownloadAIFile, SaveFeedbackCommand, UpdateFeedbackCommand } from "../commands";
import { ApiService } from "../services";
import { AnyAdapter } from "../adapters";
import { UserFeedback } from "../models";

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

  deleteFeedback(id: string, url: string) {
    const command = new DeleteFeedbackCommand(
      this.apiService,
      this.anyAdapter,
      url,
      id,
    );
    return command.execute();
  }

  saveFeedBack(feedback: UserFeedback,url: string) {
    const command = new SaveFeedbackCommand(this.apiService, this.anyAdapter, url);
    command.parameters = {
      data: feedback,
    };
    return command.execute();
  }

  updateFeedback(feedbackId: string, feedback: UserFeedback, url: string) {
    const command = new UpdateFeedbackCommand(
      this.apiService,
      this.anyAdapter,
      url,
      feedbackId,
    );
    command.parameters = {
      data: feedback,
    };
    return command.execute();
  }

}