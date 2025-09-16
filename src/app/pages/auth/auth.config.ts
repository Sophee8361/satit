import { environment } from "../../../../../environments/environment";


export const authConfig = {
  issuer: 'https://passport.yru.ac.th',
  authorizeEndpoint: 'https://passport.yru.ac.th/oauth/authorize',
  tokenEndpoint: 'https://passport.yru.ac.th/oauth/token',
  logoutEndpoint: 'https://passport.yru.ac.th/auth/client-logout?redirect_uri=' + environment.app_reUrl,
  userinfoEndpoint: 'https://passport.yru.ac.th/apis/v1/identity/userinfo',
  redirectUri: environment.oauth.redirectUri,
  clientId: environment.oauth.clientId,
  clientSecret: environment.oauth.clientSecret,
  scope: '*'
};
