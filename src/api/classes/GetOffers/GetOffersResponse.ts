import { OfferList } from "../../types/offers/OfferList";
import { ApiResponse } from "../../ApiResponse";

export class GetOffersResponse extends ApiResponse {
  result: OfferList;
}