import { FormAction } from "@/lib/enum/form-action";
import { UserTabs } from "@/lib/enum/user-tab.enum";

export function getUsersModalHeading(tab: UserTabs, formAction?: FormAction) {
  if (!formAction) {
    return "";
  }

  let entity = tab.toString();
  entity = entity.substring(0, 1).toUpperCase() + entity.substring(1, entity.length).toLowerCase();
  
  let action = formAction.toString();
  action = formAction.substring(0, 1).toUpperCase() + formAction.substring(1, formAction.length).toLowerCase();

  return `${action} ${entity}`;
}