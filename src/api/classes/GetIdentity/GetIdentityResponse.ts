import { IdentityDefinition } from "../../types/identity/IdentityDefinition";
import { ApiResponse } from "../../ApiResponse";

export class GetIdentityResponse extends ApiResponse {
  result: {
    identity: IdentityDefinition;
    status: string;
    canspendfor: boolean;
    cansignfor: boolean;
    blockheight: number;
    txid: string;
    vout: number;
    proof?: string;
  };
}