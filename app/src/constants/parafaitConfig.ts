interface EnvConfig {
    APP_ID: string;
    VERSION: string;
    DEV_SERVER_IP?: string;
    SECURITY_CODE: string;
    EncryptionKey: string;
    API_LOGIN_ID: string;
    Origin: string;
    ParafaitCentralUrlHost: string;
    APP_NAME: string;
    VERSION_NAME: string;
    PLAY_STORE_URL: string;
    APP_STORE_URL: string;
    ISTABLEUDASHBOARD:string
  }
  export const config: EnvConfig = require("../../parafait.config.json");