# Extension Verifier

A Chrome extension that helps users understand and manage their browser extensions by providing detailed information about permissions, access levels, and active status.

## Features

- 🔍 Lists all installed extensions with detailed information
- 🔒 Shows detailed permission descriptions and access levels
- 🌐 Identifies extensions active on the current page
- ⚡ Enable/disable extensions directly from the popup
- 🔗 Quick access to extension's Chrome Web Store pages
- 🔍 Search functionality to find specific extensions
- ⚠️ Warnings for extensions with broad website access

## Installation

### From Chrome Web Store
1. Visit [Extension Verifier on Chrome Web Store](https://chrome.google.com/webstore/detail/[extension-id])
2. Click "Add to Chrome"
3. Confirm the installation

### For Development
1. Clone this repository:
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extension directory

## Usage

1. Click the Extension Verifier icon in your Chrome toolbar
2. View the list of installed extensions
3. See which extensions are active on your current page
4. Use the search box to filter extensions
5. Toggle extensions on/off using the switches
6. Click "View in Store" to see more details about any extension

## Permissions Used

- `management`: Required to list and manage installed extensions
- `tabs`: Used to determine which extensions are active on the current page
- `activeTab`: Provides secure access to the active tab information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Privacy

This extension:
- Does not collect any personal information
- Only accesses information about installed extensions
- Does not transmit any data to external servers
- All processing is done locally in your browser

## Author

Akash Dubey
- Website: [verifyextensions](https://verifyextensions.com/)

<!-- ## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details -->

## Acknowledgments

- Chrome Extensions API Documentation
- Contributors and users who provide feedback

