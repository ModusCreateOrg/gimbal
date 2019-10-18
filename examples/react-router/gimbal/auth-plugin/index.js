const login = async (browser, port) => {
  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}/`);
  await page.waitForSelector('input[name=username]', {
    visible: true
  });

  const loginButton = await page.$('input[type=submit]');
  const passwordInput = await page.$('input[name=password]');
  const usernameInput = await page.$('input[name=username]');

  await usernameInput.type('gimbal');
  await passwordInput.type('password');
  await loginButton.click();
  await page.waitForNavigation();
  await page.close();
};

const AuthLogin = ({
  context
}) => {
  let servedPort;

  // get the port that was used, should be 3000 but could be 3001 and so on
  context.event.on('module/serve/create-server/start', (eventName, {
    port
  }) => {
    servedPort = port;
  });

  context.event.on('module/puppeteer/launch/end', (eventName, {
    browser
  }) => login(browser, servedPort));
};

module.exports = AuthLogin;
