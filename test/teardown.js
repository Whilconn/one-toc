module.exports = async function () {
  if (!global.browser.isConnected()) return;

  console.log(`🔔 Jest teardown, browser will be closed!`);
  await global.browser.close();
};
