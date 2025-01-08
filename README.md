
# Project Setup with Tor Integration

Use Tor network to fetch data while hiding your real IP. Follow these steps to install and configure Tor on both macOS and Windows, and then set up the project.

---

## Prerequisites

- **macOS** or **Windows** machine
- **Node.js** installed
- **Tor** installed and configured

---

## Step 1: Install Tor

### For macOS:

1. **Install Tor using Homebrew**:

   If you don’t have Homebrew installed, first install it by running:
   
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Tor** using the following command:

   ```bash
   brew install tor
   ```

3. **Start the Tor service**:

   ```bash
   brew services start tor
   ```

4. **Verify that Tor is running**:
   
   You can check if Tor is running by opening a terminal and typing:

   ```bash
   curl --socks5 127.0.0.1:9050 https://check.torproject.org
   ```

   If everything is working correctly, this should return a message saying that you are using Tor.

---

### For Windows:

1. **Download Tor for Windows** from the [official Tor website](https://www.torproject.org/download/tor/).
   
2. **Install Tor** by following the installation instructions on the website.

3. **Run the Tor service** by launching the Tor Browser, which should automatically start the Tor process in the background.

4. **Verify that Tor is running**:

   Open a Command Prompt and type the following command to ensure Tor is running:

   ```bash
   curl --socks5 127.0.0.1:9050 https://check.torproject.org
   ```

   You should see confirmation that you are using Tor.

---

## Step 2: Configure Tor

1. **Configure the `torrc` file**:
   - **On macOS**, the `torrc` file is located at `/usr/local/etc/tor/torrc`.
   - **On Windows**, the `torrc` file is usually located in `C:\Users\YourUserName\AppData\Roaming\tor\` or the installation directory.

   Open the `torrc` file and add the following lines to enable the control port:
   
   if not then use `sudo mkdir -p /usr/local/etc/tor`  

   ```plaintext
   ControlPort 9051
   HashedControlPassword <your-password-here>
   ```

   **Generate the HashedControlPassword** using this command:

   ```bash
   tor --hash-password "yourpassword"
   ```

   Replace `<your-password-here>` with the hashed password output from the command above.

2. **Restart the Tor service** after modifying the `torrc` file:

   - **On macOS**:
   
     ```bash
     brew services restart tor
     ```

   - **On Windows**, restart the Tor process via the Tor Browser or via the Windows Service Manager.

---

## Step 3: Set Up the Project

1. **Clone the repository** (or create a new project directory):

   ```bash
   git clone https://github.com/Saptadeep717/web_scraper.git
   cd <your-project-folder>
   ```

2. **Install project dependencies**:

   Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```


3. **Run the project**:

   Now, run the following command to start your development server:

   ```bash
   npm run dev
   ```

4. **Access the application**:

   Open your browser and go to:

   ```plaintext
   http://localhost:3000
   ```

   You should see your application running, and all outgoing requests will go through the Tor network.

---


   - Ensure that your application is running. If there are any errors in the terminal, fix them accordingly.
   - Make sure port 3000 is not being blocked by any firewall or another service.

---

## Conclusion

Now you have configured Tor on both macOS and Windows, set up the necessary environment, and successfully created a project that interacts with the Tor network. You can fetch data anonymously through Tor and make use of Tor's IP-masking features to enhance privacy and security.
