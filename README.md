## Content Shield
Group project for CS522 final - chrome extension for parental content blocking

### Installation
Make sure your have chrome browser (not too outdated) and access to internet.

#### Part 1: Install the extension

1. Download or clone the repository.

2. Open your chrome browser, and go the the "Manage Extensions" window, and turn on developer mode (the toggle switch should be on the top right side of the window).
![](https://raw.githubusercontent.com/ldyken53/CS522Final/main/dev-mode.png)

3. Click on "Load unpacked".
![](https://raw.githubusercontent.com/ldyken53/CS522Final/main/load-unpacked.png)

4. Navigate to the directory for the downloaded repository.

5. Load the `/extension` subdirectory.

6. The extension should be loaded into the browser. You can open you extensions tab and pin the extension to see the settings.

#### Part 2: Run the analysis server
Make sure you have node v18 installed.

1. Download or clone the repository.

2. Navigate to `/analysis-page`
```
cd analysis-page
```

3. Install packages
```
npm install
```

4. Run the server
```
npm run start
```

5. The analysis-page server should be running at `localhost:3000`

