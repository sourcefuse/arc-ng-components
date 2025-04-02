import { PostAPICommand } from ".";
import { IAdapter } from "../adapters";
import { ApiService } from "../services";


export class SaveFeedbackCommand<T> extends PostAPICommand<T> {
  constructor(apiService: ApiService, anyAdapter: IAdapter<T>, url: string) {
    super(apiService, anyAdapter, `${url}`);
  }
}
