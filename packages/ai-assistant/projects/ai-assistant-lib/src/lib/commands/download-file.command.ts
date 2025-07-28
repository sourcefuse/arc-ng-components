import { IAdapter } from "../adapters";
import { ApiService } from "../services";
import { GetAPICommand } from "./get-api.command";


export class DownloadAIFile<T> extends GetAPICommand<T> {
  constructor(
    apiService: ApiService,
    anyAdapter: IAdapter<T>,
    url: string,
    fileKey: string,
  ) {
    super(
      apiService,
      anyAdapter,
      `${url}/${fileKey}`,
    );
  }
}
