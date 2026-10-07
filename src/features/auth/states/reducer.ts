import type { AppAction } from "@/types/action";
import { ActionType } from "./action";

export const isAuthLoginReducer = (
  state = false,
  action: AppAction = {}
) => {
  if (action.type === ActionType.SET_IS_AUTH_LOGIN) {
    return action.payload;
  }

  return state;
};

export const isAuthRegisterReducer = (
  state = false,
  action: AppAction = {}
) => {
  if (action.type === ActionType.SET_IS_AUTH_REGISTER) {
    return action.payload;
  }

  return state;
};

export const isAuthLogoutReducer = (
  state = false,
  action: AppAction = {}
) => {
  if (action.type === ActionType.SET_IS_AUTH_LOGOUT) {
    return action.payload;
  }

  return state;
};