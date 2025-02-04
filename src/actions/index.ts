export const prerender = false;
import { user } from "./user";
import { business } from "./business";
import { listing } from "./listing";
import { smallActions } from "./smallActions";
import { userprofile } from "./userprofile";
import { uploadFile } from "./uploadFile";
import { oauthGoogleAuth } from "./googleauth";
export const server = {
  user,
  business,
  listing,
  smallActions,
  userprofile,
  uploadFile,
  oauthGoogleAuth,
};
