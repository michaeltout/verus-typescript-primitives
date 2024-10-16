import { CurrencyDefinition } from "../../types/currency/CurrencyDefinition";
import { ApiResponse } from "../../ApiResponse";
export declare class GetCurrencyConvertersResponse extends ApiResponse {
    result: Array<{
        [key: string]: CurrencyDefinition;
    }>;
}
