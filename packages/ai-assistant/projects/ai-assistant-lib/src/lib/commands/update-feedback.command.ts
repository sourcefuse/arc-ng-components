import { PatchAPICommand } from ".";
import { IAdapter } from "../adapters";
import { ApiService } from "../services";

export class UpdateFeedbackCommand<T> extends PatchAPICommand<T> {
  constructor(apiService: ApiService, anyAdapter: IAdapter<T>,    url: string, id: string) {
    super(
      apiService,
      anyAdapter,
      `${url}/${id}`,
    );
  }
}
