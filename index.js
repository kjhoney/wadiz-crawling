const puppeteer = require('puppeteer');

const list_url = 'https://www.wadiz.kr/web/wreward/main';

try {
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });


  const page = await browser.newPage();
  await page.goto(list_url);
  const detail_url_list = await page.evaluate(() => {
    const result = []
    const a_list = document.querySelectorAll('.PreorderMainCard_item__2FrO0');
    a_list.forEach((a => a.href && result.push(a.href)));
    return result;
  });
  
  const result = [];
  for (const url of detail_url_list) {
    const nPage = await browser.newPage();
      await nPage.goto(url);
  
      const data = await nPage.evaluate(() => {
        const img = document.querySelector('.RewardImageSlider_slickBackgroundImage__gyIH3')?.style?.backgroundImage;
        const title = document.querySelector('.BaseInfo_title__3qvLN').textContent;
        const content = document.querySelector('.BaseInfo_description__1M3_1').textContent;
        const money = document.querySelector('.BaseInfo_totalBackedAmount__1R7OU').textContent;
        return {title, img, content, money};
      });
      
      await nPage.close();
      result.push(data);
  }

  console.log(result);
})();
} catch (e) {
  console.log(e);
}