import { BlockInfo } from "../../types/block/BlockInfo";
import { ApiResponse } from "../../ApiResponse";
export declare class GetBlockResponse extends ApiResponse {
    result: string | BlockInfo;
}
