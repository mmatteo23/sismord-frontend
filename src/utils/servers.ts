import { IServerClaim, IServerOption } from "../routes/servers.types";

export function convertClaimToOption(claim: IServerClaim): IServerOption {
  return {
    value: claim.id,
    label: claim.name,
  };
}

export function convertOptionToClaim(
  option: IServerOption,
  newValue: number
): IServerClaim {
  if (newValue > -1) {
    return {
      id: option.value,
      value: newValue,
    };
  } else {
    return {
      id: option.value,
    };
  }
}