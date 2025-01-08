const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/config');
const Trend = require('../models/trendModel');
const proxy = require("selenium-webdriver/proxy");
const util = require('util');
const sleep = util.promisify(setTimeout);



const torProxy = "socks5://127.0.0.1:9050";

class TwitterScraper {
  constructor() {
    const proxyUrl = config.PROXY_URL;

    const options = new chrome.Options();
    //options.addArguments("--headless");
    options.addArguments("--no-sandbox");
    //options.addArguments("--incognito");
    options.addArguments("--disable-gpu");
    options.addArguments("--disable-dev-shm-usage");
    //options.addArguments('--start-maximized')
    options.addArguments(
      `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36`
    );
    options.addArguments(`--proxy-server=${torProxy}`);

    this.driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    this.timeout = 250000;
  }

  async humanLikeTyping(element, text) {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms * 1000)); 
    }

    for (let char of text) {
      await element.sendKeys(char);
      await sleep(Math.random() * (0.3 - 0.1) + 0.1); 
    }
  }

  async checkForPasswordField() {
    try {
      const passwordField = await this.driver.wait(
        until.elementLocated(By.css('input[name="password"]')),
        3000 
      );
      console.log("Password field located.");
      return passwordField;
    } catch (error) {
      console.log("Password field did not appear within 3 seconds.");
      return null; 
    }
  }

  async handleUnusualLogin() {
    try {
      // Wait for the page with the unusual login message to load
      const unusualLoginMessage = await this.driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(), 'There was unusual login activity')]")
        ),
        this.timeout
      );
      console.log("Unusual login activity page detected.");

      const emailField = await this.driver.wait(
        until.elementLocated(
          By.css('input[data-testid="ocfEnterTextTextInput"]')
        ), 
        this.timeout
      );
      console.log("Email input field located.");

      await this.humanLikeTyping(emailField, config.TWITTER_EMAIL);
      console.log("Email address entered.");

      await emailField.sendKeys(Key.RETURN);

      const passwordField = await this.checkForPasswordField();
      if (passwordField) {
        await passwordField.sendKeys(config.TWITTER_PASSWORD, Key.RETURN);
        await this.handleAccountSafePage();
      } else {
        console.log("No password field after email...");
        await this.handleAccountSafePage();
      }
    } catch (error) {
      console.error(`Error handling unusual login activity: ${error.message}`);
    }
  }
  async handleAccountSafePage() {
    try {
      // Wait for the page with the unusual login message to load
      const unusualLoginMessage = await this.driver.wait(
        until.elementLocated(
          By.xpath(
            "//*[contains(text(), 'Verify your identity by entering the email address associated with your X account.')]"
          )
        ),
        7000
      );
      console.log("Help us keep your account safe page detected.");

      // Locate the email input field
      const emailField = await this.driver.wait(
        until.elementLocated(
          By.css('input[data-testid="ocfEnterTextTextInput"]')
        ), 
        10000
      );
      console.log("Email input 2 field located.");

      // Enter the email address
      await this.humanLikeTyping(emailField, config.TWITTER_EMAIL);
      console.log("Email address entered.");
      console.log("Next button not found, pressing Enter instead.");
      await emailField.sendKeys(Key.RETURN);

    } catch (error) {
      console.error(`Error handling Account safe page: ${error.message}`);
    }
  }
  async login() {
    try {
      // login page
      await this.driver.get("https://x.com/login");


      const usernameField = await this.driver.wait(
        until.elementLocated(By.css('input[autocomplete="username"]')), 
        this.timeout
      );
      console.log("Username field located.");
      await this.humanLikeTyping(usernameField, config.TWITTER_USERNAME);
      await usernameField.sendKeys(Key.RETURN);

      const passwordField = await this.checkForPasswordField();
      if (passwordField) {
        // Password field exists; enter the password
        await passwordField.sendKeys(config.TWITTER_PASSWORD, Key.RETURN);
      } else {
        console.log("Handling alternative login flow...");
        await this.handleUnusualLogin();
      }

      // Wait for successful login
      await this.driver.wait(until.urlContains("home"), this.timeout);
      console.log("Login successful.");
      this.driver.sleep(3000);


    } catch (error) {
      throw new Error(`Twitter login failed: ${error.message}`);
    }
  }

  async getTrendingTopics() {
    try {
     console.log("Explore menu fetching....");
      await this.driver.get("https://x.com/settings/explore/location");
      await this.driver.sleep(5000);
       try {
         // Locate the search bar
         const searchBar = await this.driver.findElement(
           By.css('input[data-testid="locationSearchBox"]')
         );

         await searchBar.click();
         console.log("Search bar clicked.");
         await searchBar.sendKeys("India");
         console.log("Typed 'India' into the search bar.");

         const indiaOption = await this.driver.wait(
           until.elementLocated(By.xpath('//span[contains(text(),"India")]')),
           5000 
         );
         console.log("India option located.");

         // Click on the "India" option
         await indiaOption.click();
         console.log("Clicked on 'India' option.");

         // Optionally press the Enter key if needed
         await indiaOption.sendKeys(Key.RETURN);
         console.log("Confirmed selection by pressing Enter.");
       } catch (error) {
         console.error(`Error selecting India option: ${error}`);
       }

      console.log("fetching indian trends...");
      await this.driver.executeScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})");
      
      await this.driver.get(
        "https://x.com/explore/tabs/trending?location=23424848"
      );
      await this.driver.sleep(8000);
      await this.driver.wait(
        until.elementLocated(By.css('[data-testid="trend"]')),
        this.timeout
      );

      const trends = await this.driver.findElements(
        By.css('[data-testid="trend"]')
      );
      const trendingData = [];

      for (let i = 0; i < Math.min(7, trends.length); i++) {
        const trendElement = await trends[i].getText(); // Get the whole text
        const parts = trendElement.split("\n");
        //console.log(parts);
        let name = "";
        let posts = "0 posts";

        const filteredParts = parts.filter(
          (part) => !/^\d+(\.\d+)?$/.test(part) && part !== "·"
        );
        
        for (let part of filteredParts) {
          // Check if the part contains a hashtag or valid
          if (part[0]=="#" || part.includes("#") ) {
            name = part.trim();
            break;
          } else if (!part.includes("posts") && !part.includes("Trending") && part.trim() !== "") {
            name = part.trim();
            break; 
          }
        }
        for (let part of parts) {
          if (part.includes("posts")) {
            posts = part; 
          }
        }
        const trending = parts.filter((str) =>
          /Trending.*in|in.*Trending/.test(str)
        );

        if (name && posts) {
          const trend = {
            name: name,
            posts: posts,
          };
          trendingData.push(trend);
          //console.log(trending);
        }
      }

      return trendingData;
    } catch (error) {
      throw new Error(`Failed to fetch trends: ${error.message}`);
    }
  }

  async getIpAddress() {
    try {
      await this.driver.get("http://httpbin.org/ip");
      const body = await this.driver.findElement(By.tagName("pre"));
      const response = await body.getText();
      console.log("ip address: ", response);
      return JSON.parse(response).origin;
    } catch (error) {
      throw new Error(`Failed to fetch IP address: ${error.message}`);
    }
  }

  async saveTrendsToDB(trends, ipAddress) {
    const trendDoc = {
      ipAddress,
      fetchedAt: new Date(),
      trends,
    };

    const newTrend = new Trend(trendDoc);
    await newTrend.save();
    console.log(newTrend);
    console.log("Trends saved successfully!");
  }

  async close() {
    if (this.driver) {
      await this.driver.quit();
    }
  }
}

module.exports = TwitterScraper;

