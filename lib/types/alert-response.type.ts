import { StatusCode } from "../enum/status-code";

export type AlertResponse = {
  message: string;
  status: StatusCode;
}