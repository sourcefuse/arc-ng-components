import { IAdapter } from "../adapters";
import { ApiService } from "../services";
import { DelAPICommand } from "./delete-api.command";


export class DeleteFeedbackCommand<T> extends DelAPICommand<T> {
  constructor(apiService: ApiService, adapter: IAdapter<T>, url:string, id: string) {
    super(
      apiService,
      adapter,
      `${url}/${id}`,
    );
  }
}
