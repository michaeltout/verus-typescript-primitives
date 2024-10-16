import { RawTransaction } from "../../types/transaction/RawTransaction";
import { ApiResponse } from "../../ApiResponse";
export declare class GetRawTransactionResponse extends ApiResponse {
    result: string | RawTransaction;
}
