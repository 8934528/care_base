# Setup Guide

After cloning the project, in the root dir, create a `.env` file and perform a copy and paste the following in the `.env` file:

```env
#POSTGRESQL
DB_PASSWORD=[YOUR_POSTGRESQL_PASSWORD]
JWT_KEY=[YOUR_JWT_KEY]
DB_HOST=localhost
DB_NAME=carebase
DB_USER=postgres

#TWILIO MESSAGING
TWILIO_ACCOUNT_SID=[YOUR_TWILIO_ACCOUNT_SID]
TWILIO_AUTH_TOKEN=[YOUR_TWILIO_AUTH_TOKEN]
TWILIO_PHONE_NUMBER=[YOUR_TWILIO_PHONE_NUMBER]
TWILIO_WHATSAPP_NUMBER=[YOUR_TWILIO_WHATSAPP_NUMBER]
```

Then run the backend and the frontend using differnt terminal

## **Terminal 1**

```text
cd backend/CareBase.API
dotnet clean
dotnet restore
dotnet run
```

## **Terminal 2**

```text
cd frontend
npm install
npm run dev
```

If you don't want to use multiple terminals, you can use the included `Makefile`. Simply run the help command to see all available commands:

```bash
make help
```

Please make sure that when using the Makefile, you have `make` downloaded and installed:

The specific download depends on your operating system:

### 1. Windows

Windows does not include a Make utility by default. You have several options:

- **Chocolatey**: If you use this package manager, run `choco install make` in a terminal with Administrator privileges.
- **MinGW-w64**: This provides `mingw32-make.exe`. You can download it through the MinGW-w64 installer or MSYS2.
- **GnuWin32**: You can download a standalone version of make for Windows from the GnuWin32 project.

### 2. macOS

- **Xcode Command Line Tools**: Make is included in this package. To install it, open your terminal and run: `xcode-select --install`
- Alternatively, you can install it via Homebrew using `brew install make`.

### 3. Linux

- **Pre-installed**: Most Linux distributions come with make already installed.
- **Manual Install**: If it’s missing, use your package manager (e.g., `sudo apt install make` on Ubuntu/Debian or `sudo dnf install make` on Fedora/RHEL).

---
**Additional Recommended Tools:**
While not strictly required for the Makefile itself, you will likely need:

- **Text Editor/IDE**: To create and edit your Makefile.
- **VS Code**: You can download the Makefile Tools extension to get syntax highlighting and build support within the editor.
