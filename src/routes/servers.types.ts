export type IServerSettings = {
  id: number;
  name: string;
  claims: IClaimsPerRole[];
};

export interface IClaimsPerRole {
  [key: string]: IServerClaim[];
}

export type IServerClaim = {
  id: string;
  name?: string;
  value?: number;
};

export type IServerOption = {
  value: string;
  label?: string;
};