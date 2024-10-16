import { BlockInfo } from "../../types/block/BlockInfo";
import { ApiResponse } from "../../ApiResponse";

export class GetBlockResponse extends ApiResponse {
  result: string | BlockInfo
}
