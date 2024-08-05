
enum ERROR_TYPES {
    NONE = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NON_ACCEPTABLE = 406,
    REQUEST_TIMEOUT = 408,
    UNSUPPORTED_MEDIA_TYPE = 415,
    USER_DEFINED_ALERT = 600,
}

export class ParafaitServer {

    public static readonly DEFAULT_TIMEOUT = 59000; // 59 Sec
    public static readonly DEFAULT_HEADER = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'customerapp',
    }

    public static readonly APP_IDENTIFIER = 'CustomerApp';

    //public static readonly PUBLIC_SERVER_IP = 'https://parafaitios.parafait.com';

    public static readonly GATEWAY_URI = 'https://parafaitios.parafait.com'
    //'https://webmngapi.parafait.com' //'https://parafaitdevcentral.parafait.com' //'http://192.168.20.104:105' // 'http://192.168.20.104:506' //'ClientAppServices.asmx/GetClientForGuestApp';

    //public static readonly GATEWAY_URI = 'http://192.168.43.161:105'
    //'http://192.168.43.161:506'

    //public static readonly GATEWAY_URI='http://192.168.20.140:115' // http://192.168.20.140:506

    public static readonly ERROR_TYPES = ERROR_TYPES;

    //production
    public static readonly PUBLIC_SERVER_IP_PRODUCTION = "https://smartfunapp.parafait.com"  //"https://smartfunapp.parafait.com" 'https://parafaitios.parafait.com' ;  // //'https://dashboardtestwebapi.parafait.com' // "https://smartfunapp.parafait.com"  //   //'https://parafaitdevcentral.parafait.com'  //"https://smartfunapp.parafait.com" "https://smartfunapp.parafait.com" //;

    //aws
    public static readonly PUBLIC_SERVER_IP_LOCAL = 'https://parafaitdevcentral.parafait.com';





    // public static readonly PUBLIC_SERVER_IP_LOCAL = 'https://webmngapi.parafait.com' //'https://parafaitios.parafait.com'

    //Local
    // public static readonly PUBLIC_SERVER_IP_LOCAL = 'http://192.168.20.140:86';
    //public static readonly PUBLIC_SERVER_IP_LOCAL = 'https://parafaitios.parafait.com'

    //Controllers
    public static readonly CUSTOMERAPP_CONTROLLER = 'CustomerApp';
    public static readonly CUSTOMER_CONTROLLER = 'Customer';
    public static readonly SITESETUP_CONTROLLER = 'SiteSetup';
    public static readonly CARDS_CONTROLLER = 'Cards';
    public static readonly PRODUCTS_CONTROLLER = 'Product';
    public static readonly TRANSACTION_CONTROLLER = 'Transaction';
    public static readonly COMMONSERVICES_CONTROLLER = 'CommonServices';
    public static readonly EXECUTION_CONTEXT_CONTROLLER = 'ParafaitEnvironment';
    public static readonly ORGANIZATION_CONTROLLER = 'Organization';
    public static readonly LOGIN_CONTROLLER = 'Login';
    public static readonly POS_CONTROLLER = 'POS';
    public static readonly COMMUNICATION_CONTROLLER = 'api/Communication';
    public static readonly ACCOUNTS_CONTROLLER = ParafaitServer.CUSTOMER_CONTROLLER + '/Account';


    // EndPoints
    // CustomerApp Controller
    public static readonly APP_CONFIGURATION = ParafaitServer.CUSTOMERAPP_CONTROLLER + '/CustomerAppConfiguration';
    public static readonly USER_LOG = ParafaitServer.CUSTOMERAPP_CONTROLLER + '/UserLog';
    public static readonly TERMS_AND_CONDITIONS = ParafaitServer.CUSTOMERAPP_CONTROLLER + '/TermsAndConditions';


    // Customer Controller
    public static readonly CUSTOMER_UI_METADATA = ParafaitServer.CUSTOMER_CONTROLLER + '/CustomerUIMetadata';
    public static readonly CUSTOMER = ParafaitServer.CUSTOMER_CONTROLLER + '/Customers';
    public static readonly CUSTOMER_DEVICE_VERIFICATION = ParafaitServer.CUSTOMER_CONTROLLER + '/CustomerDeviceVerifications';
    public static readonly CONTACT_TYPE = ParafaitServer.CUSTOMER_CONTROLLER + '/ContactTypes';
    public static readonly CUSTOMER_OTP_VERFICATION = ParafaitServer.CUSTOMER_CONTROLLER + '/CustomerVerifications';


    //SiteSetup
    //public static readonly SITES = ParafaitServer.SITESETUP_CONTROLLER + '/Site';
    public static readonly SITES = ParafaitServer.ORGANIZATION_CONTROLLER + '/Sites';


    //Home
    public static readonly SITES_URL = ParafaitServer.EXECUTION_CONTEXT_CONTROLLER + '/ExecutionContext';


    //Products
    public static readonly PRODUCT_DISPLAY_GROUPS = ParafaitServer.POS_CONTROLLER + '/POSMachines';
    public static readonly PRODUCTS_BY_DGID = ParafaitServer.PRODUCTS_CONTROLLER + '/Products';


    //Transaction
    public static readonly TRANSACTIONS = ParafaitServer.TRANSACTION_CONTROLLER + '/Transactions'
    public static readonly PAYMENT_MODES = ParafaitServer.TRANSACTION_CONTROLLER + '/PaymentModes'


    //CommonServices
    public static readonly RICH_CONTENT = ParafaitServer.COMMONSERVICES_CONTROLLER + '/RichContent';
    public static readonly VALIDATE_CAPTCHA = ParafaitServer.COMMONSERVICES_CONTROLLER + '/GoogleCaptcha';
    public static readonly PROMOTIONS = ParafaitServer.COMMONSERVICES_CONTROLLER + '/FileUpload';


    //Accounts
    public static readonly ACCOUNTS = ParafaitServer.ACCOUNTS_CONTROLLER + '/Accounts';
    public static readonly ACCOUNT_ACTIVITY = ParafaitServer.ACCOUNTS_CONTROLLER + '/AccountServices';

    //Authenticate
    public static readonly AUTHENTICATE_USER = ParafaitServer.LOGIN_CONTROLLER + '/AuthenticateUserNew';

    public static readonly LOGIN_SYSTEM_USER = 'Login/AuthenticateSystemUsers'

    //Communication

    public static readonly PUSH_NOTIFICATION_DEVICES = ParafaitServer.COMMUNICATION_CONTROLLER + '/PushNotificationDevices';
    public static readonly MESSAGING_REQUESTS = ParafaitServer.COMMUNICATION_CONTROLLER + '/MessagingRequests';

    //Default Container
    public static readonly DEFAULT_CONFIGURATION = "api/Configuration/ParafaitDefaultContainer";


}

