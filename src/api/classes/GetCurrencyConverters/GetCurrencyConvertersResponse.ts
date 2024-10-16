import { CurrencyDefinition } from "../../types/currency/CurrencyDefinition";
import { ApiResponse } from "../../ApiResponse";

export class GetCurrencyConvertersResponse extends ApiResponse {
  result: Array<{
    [key: string]: CurrencyDefinition
  }>
}