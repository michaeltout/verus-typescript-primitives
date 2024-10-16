import { BlockInfo } from "./types/block/BlockInfo";
import { IdentityDefinition } from "./types/identity/IdentityDefinition";
import { OfferForMaking } from "./types/offers/OfferForMaking";
import { ListedOffer } from "./types/offers/OfferList";
import { RawTransaction } from "./types/transaction/RawTransaction";

export type ApiPrimitive =
  | string
  | number
  | boolean
  | null
  | OfferForMaking
  | ApiPrimitiveJson
  | ListedOffer
  | Array<ApiPrimitive>
  | IdentityDefinition
  | BlockInfo
  | RawTransaction;

export type ApiPrimitiveJson = { [key: string]: ApiPrimitive | undefined };

export type RequestParams = Array<ApiPrimitive>