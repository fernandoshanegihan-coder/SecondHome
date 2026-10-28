import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(80000);
await page.goto('http://127.0.0.1:5173');
await page.getByLabel('Your new city').fill('London');await page.getByRole('button',{name:'Search cities'}).click();
await page.getByRole('button',{name:/London,.*United Kingdom/}).first().click();
for(const [name,kind] of [['Radiohead','artist'],['Spirited Away','movie'],['Nike','brand']]){
 await page.getByLabel('Search a favourite').fill(name);await page.getByRole('button',{name:'Search favourites'}).click();await page.getByRole('button',{name:new RegExp('^'+name+' — '+kind)}).first().click();
}
await page.getByRole('button',{name:'Find my three discoveries'}).click();
await page.locator('.discovery-card').nth(2).waitFor();
const names=await page.locator('.discovery-card h3').allTextContents();
console.log(JSON.stringify({liveBrowserDiscoveries:names}));
await page.screenshot({path:'.sites-runtime/live-results.png',fullPage:true});
await page.getByRole('button',{name:'Try another place'}).first().click();await page.getByRole('button',{name:'Something different',exact:true}).click();
await page.waitForFunction(first=>document.querySelector('.discovery-card h3')?.textContent!==first,names[0]);
const changed=await page.locator('.discovery-card h3').allTextContents();
if(changed[1]!==names[1]||changed[2]!==names[2])throw new Error('Other discoveries changed');
console.log(JSON.stringify({replacement:changed[0],othersPreserved:true}));
await browser.close();
