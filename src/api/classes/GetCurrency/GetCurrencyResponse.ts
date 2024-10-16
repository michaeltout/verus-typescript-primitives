import { CurrencyDefinition } from "../../types/currency/CurrencyDefinition";
import { ApiResponse } from "../../ApiResponse";

export class GetCurrencyResponse extends ApiResponse {
  result: CurrencyDefinition;
}
