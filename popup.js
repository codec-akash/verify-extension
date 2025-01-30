import { ExtensionManager } from './models/ExtensionManager.js';
import { apiService } from './services/api.js';

class PopupController {
    constructor() {
        this.extensionManager = new ExtensionManager();
        this.extensionsList = document.getElementById('extensions-list');
        this.tabInfo = document.getElementById('tab-info');
        this.currentUrl = document.getElementById('current-url');
        this.activeCount = document.getElementById('active-extensions-count');
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('extensionsUpdated', (event) => {
            this.displayExtensions(event.detail.extensions);
        });
    }

    async initialize() {
        try {
            await this.loadAndDisplayExtensions();
            await this.updateTabInfo();
            this.addSearchFunctionality();
        } catch (error) {
            this.showError('Failed to load extensions');
            console.error(error);
        }
    }

    async loadAndDisplayExtensions() {
        const extensions = await this.extensionManager.loadExtensions();
        this.displayExtensions(extensions);

        // Optional: Send data to your backend
        try {
            await apiService.sendExtensionData(extensions);
        } catch (error) {
            console.error('Failed to send extension data:', error);
        }
    }

    displayExtensions(extensions) {
        this.extensionsList.innerHTML = '';
        extensions.forEach(extension => {
            const card = this.extensionManager.createExtensionCard(extension);
            this.extensionsList.appendChild(card);
        });
    }

    addSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredExtensions = this.extensionManager.extensions.filter(ext =>
                    ext.name.toLowerCase().includes(searchTerm)
                );
                this.displayExtensions(filteredExtensions);
            });
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        this.extensionsList.appendChild(errorDiv);
    }

    async updateTabInfo() {
        const currentTab = this.extensionManager.currentTab;
        if (currentTab) {
            this.currentUrl.textContent = `Current page: ${currentTab.url}`;
            const activeCount = this.extensionManager.activeExtensions.length;
            this.activeCount.innerHTML = `
                <span class="active-count">${activeCount}</span> extension${activeCount !== 1 ? 's' : ''} 
                active on this page
            `;
        } else {
            this.tabInfo.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const popup = new PopupController();
    popup.initialize();
}); 