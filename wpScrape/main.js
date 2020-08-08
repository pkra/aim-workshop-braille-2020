const puppeteer = require('puppeteer');
const sre = require('speech-rule-engine');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
sre.setupEngine({
  modality: 'braille',
  locale: 'nemeth',
  mode: 'sync',
});
sre.engineReady();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    'https://en.wikipedia.org/w/index.php?title=Matrix_multiplication&printable=yes',
    {
      waitUntil: 'domcontentloaded',
    }
  );
  const result = await page.evaluate(() => {
    const main = document.querySelector('#bodyContent');
    document.body.innerHTML = main.innerHTML;
    document.head.querySelectorAll('*').forEach((node, index) => {
      if (index > 1) node.remove();
    });

    // from page css
    document
      .querySelectorAll(
        '.noprint, .catlinks, .magnify, .mw-cite-backlink, .mw-editsection, .mw-editsection-like, .mw-hidden-catlinks, .mw-indicators, .mw-redirectedfrom, .patrollink, .usermessage, #column-one, #footer-places, #mw-navigation, #siteNotice, #f-poweredbyico, #f-copyrightico, li#about, li#disclaimer, li#mobileview, li#privacy'
      )
      .forEach((node, index) => {
        node.remove();
      });

    document
      .querySelectorAll(
        '.mw-jump-link, .warningbox, .shortdescription, input, .noprint, script, #catlinks, #mw-navigation, .oo-ui-element-hidden'
      )
      .forEach((node, index) => {
        node.remove();
      });
    document
      .querySelectorAll('.mwe-math-element')
      .forEach(
        (node) => (node.innerHTML = node.querySelector('math').outerHTML)
      );
    document
      .querySelectorAll('bdi')
      .forEach((node) => (node.outerHTML = node.innerHTML));
    document
      .querySelectorAll('*')
      .forEach((node) => node.removeAttribute('id'));
    return document.documentElement.innerHTML;
  });
  await browser.close();
  const dom = new JSDOM(`<!DOCTYPE html>${result}`);
  const document = dom.window.document;
  document
    .querySelectorAll('.mwe-math-element')
    .forEach((node) => (node.innerHTML = sre.toSpeech(node.innerHTML)));
  console.log(`<!DOCTYPE html>${document.documentElement.innerHTML}`);
})();
