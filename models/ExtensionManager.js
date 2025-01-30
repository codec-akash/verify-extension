import {
    formatPermissions, formatHostPermissions, hasFullAccess,
    getActiveTabInfo, getActiveExtensionsForUrl
} from '../utils/helpers.js';

export class ExtensionManager {
    constructor() {
        this.extensions = [];
        this.currentTab = null;
        this.activeExtensions = [];
    }

    async loadExtensions() {
        return new Promise((resolve) => {
            chrome.management.getAll((extensions) => {
                this.extensions = extensions;
                this.updateActiveExtensions();
                resolve(extensions);
            });
        });
    }

    async updateActiveExtensions() {
        this.currentTab = await getActiveTabInfo();
        if (this.currentTab) {
            this.activeExtensions = getActiveExtensionsForUrl(this.extensions, this.currentTab.url);
        }
    }

    createExtensionCard(extension) {
        const card = document.createElement('div');
        card.className = 'extension-card';

        // Add active indicator if extension is active on current tab
        if (this.activeExtensions.some(e => e.id === extension.id)) {
            card.classList.add('active-on-page');
        }

        // Name and version
        const name = this.createNameElement(extension);

        // Container for controls
        const controls = this.createControlsElement(extension);

        // Permissions
        const permissions = this.createPermissionsElement(extension);

        // Host permissions
        const hostPermissions = this.createHostPermissionsElement(extension);

        // Status
        const status = this.createStatusElement(extension);

        // Assemble card
        [name, controls, permissions, hostPermissions, status].forEach(element => {
            if (element) card.appendChild(element);
        });

        return card;
    }

    createNameElement(extension) {
        const name = document.createElement('div');
        name.className = 'extension-name';
        name.textContent = `${extension.name} (v${extension.version})`;
        return name;
    }

    createControlsElement(extension) {
        const controls = document.createElement('div');
        controls.className = 'extension-controls';

        // Add active badge if extension is active on current page
        if (this.activeExtensions.some(e => e.id === extension.id)) {
            controls.appendChild(this.createActiveOnPageBadge());
        }

        // Toggle switch
        const toggle = document.createElement('label');
        toggle.className = 'switch';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = extension.enabled;
        input.addEventListener('change', () => this.toggleExtension(extension.id, input.checked));
        const slider = document.createElement('span');
        slider.className = 'slider';
        toggle.appendChild(input);
        toggle.appendChild(slider);

        // Store link
        const storeLink = document.createElement('a');
        storeLink.href = `https://chrome.google.com/webstore/detail/${extension.id}`;
        storeLink.target = '_blank';
        storeLink.className = 'store-link';
        storeLink.textContent = 'View in Store';

        controls.appendChild(toggle);
        controls.appendChild(storeLink);

        return controls;
    }

    async toggleExtension(extensionId, enable) {
        try {
            await chrome.management.setEnabled(extensionId, enable);
            // Refresh the extension list
            await this.loadExtensions();
            // Emit an event for the UI to update
            window.dispatchEvent(new CustomEvent('extensionsUpdated', {
                detail: { extensions: this.extensions }
            }));
        } catch (error) {
            console.error('Failed to toggle extension:', error);
        }
    }

    createPermissionsElement(extension) {
        const permissions = document.createElement('div');
        permissions.className = 'permission-list';
        permissions.innerHTML = this.getDetailedPermissions(extension.permissions);
        return permissions;
    }

    getDetailedPermissions(permissions) {
        if (!permissions || permissions.length === 0) {
            return '<em>No special permissions required</em>';
        }

        const permissionDescriptions = {
            "tabs": "Can access your browser tabs",
            "storage": "Can store data on your device",
            "webRequest": "Can monitor network requests",
            "cookies": "Can access website cookies",
            "downloads": "Can manage downloads",
            "history": "Can access browsing history",
            // Add more permission descriptions as needed
        };

        return '<strong>Permissions:</strong><br>' +
            permissions.map(permission => {
                const description = permissionDescriptions[permission] || permission;
                return `• ${description}`;
            }).join('<br>');
    }

    createHostPermissionsElement(extension) {
        if (!extension.hostPermissions?.length) return null;

        const hostPermissions = document.createElement('div');
        hostPermissions.className = 'permission-list';
        hostPermissions.innerHTML = formatHostPermissions(extension.hostPermissions);

        if (hasFullAccess(extension.hostPermissions)) {
            const warning = document.createElement('div');
            warning.className = 'warning';
            warning.textContent = '⚠️ This extension has access to all websites';
            hostPermissions.appendChild(warning);
        }

        return hostPermissions;
    }

    createStatusElement(extension) {
        const status = document.createElement('div');
        status.textContent = `Status: ${extension.enabled ? 'Enabled' : 'Disabled'}`;
        return status;
    }

    createActiveOnPageBadge() {
        const badge = document.createElement('div');
        badge.className = 'active-badge';
        badge.textContent = '🟢 Active on this page';
        return badge;
    }
} 