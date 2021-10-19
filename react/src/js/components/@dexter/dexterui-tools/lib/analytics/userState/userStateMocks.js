window.adobeid = {
    scope: 'AdobeID,openid,creative_cloud,gnav,read_organizations,additional_info.projectedProductContext,sao.ACOM_CLOUD_STORAGE,sao.stock,sao.cce_private,additional_info.roles'
};
var profile = {
    account_type: 'type1',
    address: 'foo bar, WA, 98119, US',
    utcOffset: 'null',
    preferred_languages: ['en-us'],
    serviceAccounts: [{
        ident: '075707F953574EA40A490D34-068F24D75357599A0A490D36',
        serviceCode: 'creative_cloud',
        serviceStatus: 'ACTIVE',
        serviceLevel: 'CS_LVL_1',
        params: [{
            pn: 'storage_quota',
            pv: '2'
        }, {
            pn: 'version_retention_time',
            pv: '10'
        }, {
            pn: 'storage_region',
            pv: 'US'
        }]
    }, {
        ident: 'A8630E78EEA5A8F026EB',
        serviceCode: 'stock',
        serviceStatus: 'ACTIVE',
        serviceLevel: 'FREE_BASIC',
        ownerGuid: '068F24D75357599A0A490D36',
        ownerAuthSrc: 'WCD',
        ownerAcctLabel: null,
        delegateGuid: '068F24D75357599A0A490D36',
        delegateAuthSrc: 'WCD',
        delegateAcctLabel: null,
        serviceUrl: '',
        subRef: 'A8630E78EEA5A8F026EB',
        commerce_ref: 'A8630E78EEA5A8F026EB',
        createDts: 1484336306000,
        modDts: 1484344237000,
        effectiveEndDts: 1486972799000,
        params: [{
            pn: 'market_segment',
            pv: 'COM'
        }, {
            pn: 'overage_allowed',
            pv: 'true'
        }, {
            pn: 'plan',
            pv: '/Applications/StockPT1'
        }]
    }, {
        ident: '068F24D75357599A0A490D36-068F24D75357599A0A490D36',
        serviceCode: 'ACOM_CLOUD_STORAGE',
        serviceStatus: 'ACTIVE',
        serviceLevel: 'ACOM_FREE',
        ownerGuid: '068F24D75357599A0A490D36',
        ownerAuthSrc: 'WCD',
        ownerAcctLabel: null,
        delegateGuid: '068F24D75357599A0A490D36',
        delegateAuthSrc: 'WCD',
        delegateAcctLabel: null,
        serviceUrl: '',
        createDts: 1414472557000,
        modDts: 1473846574000,
        effectiveEndDts: 1486022399000,
        params: [{
            pn: 'storage_quota',
            pv: '101'
        }, {
            pn: 'svc_provider_code',
            pv: 'ADUS'
        }, {
            pn: 'storage_region',
            pv: 'US'
        }]
    }, {
        ident: '9D88A8F76C2B36F14B0B',
        serviceCode: 'stock',
        serviceStatus: 'ACTIVE',
        serviceLevel: 'PAID_LVL_1',
        ownerGuid: '068F24D75357599A0A490D36',
        ownerAuthSrc: 'WCD',
        ownerAcctLabel: null,
        delegateGuid: '068F24D75357599A0A490D36',
        delegateAuthSrc: 'WCD',
        delegateAcctLabel: null,
        serviceUrl: '',
        subRef: '9D88A8F76C2B36F14B0B',
        commerce_ref: '9D88A8F76C2B36F14B0B',
        createDts: 1484336851000,
        modDts: 1519633183000,
        effectiveEndDts: 1520924399000,
        params: [{
            pn: 'market_segment',
            pv: 'COM'
        }, {
            pn: 'plan',
            pv: '/Applications/StockSubSmallAnnual'
        }, {
            pn: 'overage_allowed',
            pv: 'true'
        }]
    }],
    displayName: 'user1 org19',
    roles: [{
        principal: '075707F953574EA40A490D34@AdobeOrg:1526860',
        organization: '075707F953574EA40A490D34@AdobeOrg',
        named_role: 'org_admin',
        target: '075707F953574EA40A490D34@AdobeOrg',
        target_type: 'TRG_ORG',
        target_data: {}
    }],
    last_name: 'org19',
    userId: '068F24D75357599A0A490D36@AdobeID',
    projectedProductContext: [],
    emailVerified: 'true',
    toua: [{
        touName: 'creative_cloud',
        current: true
    }],
    phoneNumber: null,
    countryCode: 'US',
    name: 'user1 org19',
    mrktPerm: 'EMAIL:true',
    mrktPermEmail: 'true',
    first_name: 'user1',
    email: 'qfang+org19+user1@adobetest.com'
};

export default profile;