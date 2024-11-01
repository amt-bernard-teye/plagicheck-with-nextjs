import { StatusCode } from "../enum/status-code";

type AlertResponse = (value: {
  message: string;
  status: StatusCode
}) => void;

export function setAlertErrorState(error: unknown, setAlertResponse: AlertResponse) {
  let message = error instanceof Error ? error.message : "Something went wrong";
  setAlertResponse({
    message,
    status: StatusCode.BAD_REQUEST
  });
}


export function setAlertSuccessState(message: string, setAlertResponse: AlertResponse) {
  setAlertResponse({
    message: message,
    status: StatusCode.SUCCESS
  });
}