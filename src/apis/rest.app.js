import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import { CookieStorage } from 'cookie-storage';
import rest from '@feathersjs/rest-client';
import Axios from 'axios';
import services from './services.json';

export const authCookieName = 'platemate-user-ticket';

/**
 * CookieStorage
 * @type {CookieStorage}
 */
export const cookieStorage = new CookieStorage();

const restClient = rest(process.env.baseUrl);

/**
 * Feathers application
 * @type {createApplication.Application<any>}
 */
const restApp = feathers();

restApp.configure(restClient.axios(Axios));

restApp.configure(
    auth({
        path: services.authentication,
        // cookie: process.env.NEXT_COOKIE_NAME,
        cookie: authCookieName,
        // storageKey: process.env.NEXT_COOKIE_NAME,
        storageKey: authCookieName,
        storage: cookieStorage,
    }),
);

export default restApp;

export const uploadService = restApp.service(services.upload);

export const uploadFile = async (file) => {
    const formData = new FormData();
    await formData.append('uri[]', file);
    await formData.append('fileType', '1');
    await formData.append('purpose', '2');
    return uploadService.create(formData);
};

export const uploadMultipleFile = (file) => {
    console.log('File inside --> ', file);
    const formData = new FormData();
    for (let i = 0; i < file.length ; i++){
        formData.append('uri[]', file[i]);
    }
    return uploadService.create(formData);
};

export const UsersService = restApp.service(services['users']);
export const AuthenticationService = restApp.service(services.authentication);
export const FamilyMemberService = restApp.service(services['family-member']);
export const RelationService = restApp.service(services['relation']);
export const ServiceRequestService = restApp.service(services['service-request']);
export const RequestTypeService = restApp.service(services['service-type']);
export const UserDashboardService = restApp.service(services['userDashboard']);
export const RestaurantDashboardService = restApp.service(services['restaurantDashboard']);
export const TransactionsService = restApp.service(services['transactions']);
export const InvoiceService = restApp.service(services['invoice']);
export const SupportService = restApp.service(services['support']);
export const SubscriptionService = restApp.service(services['subscription']);
export const serviceRequestManagementService = restApp.service(services['serviceRequestManagement']);

export const MenuCategoryService = restApp.service(services['menu-item-category']);
export const MenuItemService = restApp.service(services['menu-items']);
export const TableService = restApp.service(services['restaurant-table']);
export const OrderService = restApp.service(services['order']);





