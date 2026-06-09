const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded at mobile viewport (375x667)');
    
    // Take screenshot of the form area
    await page.screenshot({ path: 'mobile-form-view.png', fullPage: true });
    console.log('✅ Screenshot saved to mobile-form-view.png');
    
    // Check form field visibility
    const formExists = await page.locator('form').isVisible();
    console.log('Form visible: ' + formExists);
    
    const firstNameField = await page.locator('input[name="firstName"]').isVisible();
    console.log('First name field visible: ' + firstNameField);
    
    const emailField = await page.locator('input[name="email"]').isVisible();
    console.log('Email field visible: ' + emailField);
    
    const whatsappField = await page.locator('input[name="whatsapp"]').isVisible();
    console.log('WhatsApp field visible: ' + whatsappField);
    
    const professionField = await page.locator('select[name="profession"]').isVisible();
    console.log('Profession field visible: ' + professionField);
    
    const cityField = await page.locator('input[name="city"]').isVisible();
    console.log('City field visible: ' + cityField);
    
    const submitButton = await page.locator('button[type="submit"]').isVisible();
    console.log('Submit button visible: ' + submitButton);
    
    // Get form card dimensions
    const formCard = await page.locator('form').first().boundingBox();
    if (formCard) {
      console.log('Form card width: ' + formCard.width + 'px');
      console.log('Form card height: ' + formCard.height + 'px');
    }
    
  } catch (e) {
    console.error('Error: ' + e.message);
  }
  
  await browser.close();
})();
