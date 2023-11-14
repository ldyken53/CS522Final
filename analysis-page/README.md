## Running Analysis Page
### Installing Node and npm

There are several ways to install node.js which is required to run react.

The easiest way is to simply install node from the website:

https://nodejs.org/en/download

During the node installation, npm will be fetched as well. For your own benefit, ignore any warning messages resulting through the installation process.

Verify the installations using node -v and npm -v in the terminal. If any of the verification steps gives you a command not found error, you most likely don't have the binary path to the library on your PATH variable (check Environmental Variables on windows). Related to this point, tools like NodeJS or git also provide their own shell (terminal) but you can use everything from your normal terminal; just make sure that your PATH is configured correctly.

##### If you are using ubuntu and have multiple node versions installed, you could try also Node Version Manager
We recommend using Node Version Manager (NVM), if you are using ubuntu (we haven't tested it on other OS):

https://github.com/nvm-sh/nvm

 In the command line, use NVM to install Node. We built this demo using node v14.15.4, but any version that support create-react-app should work:

 > nvm install 14.15.4

### Fork the Github code repository

clone the github repo :

> git clone https://github.com/ldyken53/CS522Final.git
> cd analysis-page

Install the required npm packages:

> npm install

Test the program

>npm start

If all goes well, it will automatically launch a browser view to localhost:3000 (or similar) and show you the result of the code. 

### Screenshots

<img width="1662" alt="image" src="https://github.com/ldyken53/CS522Final/assets/19669471/4e322fd4-ab4c-4ea4-bb58-a05f7d605037">

