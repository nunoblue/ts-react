'use strict';
import storage from 'store/storages/localStorage';

class UserService {
    constructor(params) {
        this.currentUser = null;
        this.currentUserDetails = null;
        this.lastPublicDashboardId = null;
        this.allowedDashboardIds = [];
    }

    static logout() {
        this.clearJwtToken(true);
    }

    clearTokenData() {
        storage.remove('jwt_token');
        storage.remove('jwt_token_expiration');
        storage.remove('refresh_token');
        storage.remove('refresh_token_expireation');
    }

    clearJwtToken(doLogout) {
        this.setUserFromJwtToken(null, null, true, doLogout);
    }

    setUserFromJwtToken(jwtToken, refreshToken, notify, doLogout) {
        this.currentUser = null;
        this.currentUserDetails = null;
        this.lastPublicDashboardId = null;
        this.allowedDashboardIds = null;
        if(!jwtToken) {
            clearTokenData();
        } else {
            
        }
    }
}

export default UserService;