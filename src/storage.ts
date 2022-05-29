declare const chrome: any;
chrome.storage.local.set({ open: true }).then((res: string) => {
  console.log(res);
});
chrome.storage.local.get('open').then((res: string) => {
  console.log(res);
});
