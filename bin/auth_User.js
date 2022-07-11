require("dotenv").config();
require('isomorphic-fetch');
const azure = require('@azure/identity');
const graph = require('@microsoft/microsoft-graph-client');
const authProviders = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

async function initializeGraphForUserAuth(deviceCodePrompt) {
    
    _deviceCodeCredential = new azure.DeviceCodeCredential({
      clientId: process.env.CLIENT_ID,
      tenantId: process.env.TENANT_SCOPE,
      userPromptCallback: deviceCodePrompt
    });
    const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
      _deviceCodeCredential, {
        scopes: process.env.SCOPE.split(' ')
      });
  
    _userClient = graph.Client.initWithMiddleware({
      authProvider: authProvider
    });
}

async function getUserAsync() {
    // Ensure client isn't undefined
    if (!_userClient) {
      throw new Error('Graph has not been initialized for user auth');
    }
  
    return await _userClient.api('/me')
      // Only request specific properties
      .select(['displayName', 'mail', 'userPrincipalName'])
      .get();
  }
module.exports.getUserAsync = getUserAsync;

async function login(){
    await initializeGraphForUserAuth((info)=>{
        console.log(info.message);
        return "token";
    }).catch(err=>{
        console.log(err);
    });
    return await getUserAsync().
    then(async (e)=>{
        console.log(e)
        return await getUserTokenAsync()
    }).catch(err=>{
        console.error
    });
}



async function getUserTokenAsync() {
    // Ensure credential isn't undefined
    if (!_deviceCodeCredential) {
      throw new Error('Graph has not been initialized for user auth');
    }
  
    // Ensure scopes isn't undefined
    if (!process.env.SCOPE.split(' ')) {
      throw new Error('Setting "scopes" cannot be undefined');
    }
  
    // Request token with given scopes
    const response = await _deviceCodeCredential.getToken( process.env.SCOPE.split(' '));
    return response.token;
  }
module.exports = {
    getUserAsync:getUserAsync,
    initializeGraphForUserAuth:initializeGraphForUserAuth,
    login:login
}

/*https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=process.env.USER_ID
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=offline_access%20user.read%20mail.read
&state=12345*/