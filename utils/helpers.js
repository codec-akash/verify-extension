export const formatPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) {
        return '<em>No special permissions required</em>';
    }
    return '<strong>Permissions:</strong><br>' +
        permissions.map(permission => `• ${permission}`).join('<br>');
};

export const formatHostPermissions = (hostPermissions) => {
    if (!hostPermissions || hostPermissions.length === 0) {
        return '';
    }
    return '<strong>Host Permissions:</strong><br>' +
        hostPermissions.map(host => `• ${host}`).join('<br>');
};

export const hasFullAccess = (hostPermissions) => {
    return hostPermissions.some(host => host === '<all_urls>' || host === '*://*/*');
};

export const getActiveTabInfo = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
};

export const getActiveExtensionsForUrl = (extensions, url) => {
    if (!url) return [];
    return extensions.filter(extension => {
        if (!extension.enabled) return false;
        return extension.hostPermissions?.some(pattern => {
            try {
                const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/[.]/g, '\\.') + '$');
                return regex.test(url) || pattern === '<all_urls>';
            } catch (e) {
                return false;
            }
        });
    });
};