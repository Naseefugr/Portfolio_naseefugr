# 📊 Google Sheets Contact Form Setup Guide

Follow this simple 2-minute step-by-step guide to connect your portfolio's **Send Message** contact form directly to a Google Sheet. Every time someone submits a message on your website, it will be automatically saved as a new row in your spreadsheet.

---

## Step 1: Create a New Google Sheet

1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name your sheet: **Portfolio Contact Messages** (or any name you like).
3. In the first row (**Row 1**), enter these exact column headers:

| A | B | C | D | E |
|---|---|---|---|---|
| **Timestamp** | **Name** | **Email** | **Subject** | **Message** |

---

## Step 2: Open Google Apps Script

1. In your Google Sheet menu bar, click on **Extensions** > **Apps Script**.
2. A new tab will open with a code editor.
3. Delete any default code inside the editor (delete `function myFunction() { ... }`).
4. Copy and paste the following code into the editor:

```javascript
/**
 * Google Apps Script for Naseef Ugrapuram Portfolio Contact Form
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = data.timestamp || new Date().toLocaleString();
    var name = data.name || '';
    var email = data.email || '';
    var subject = data.subject || '';
    var message = data.message || '';
    
    // Append new row to the sheet
    sheet.appendRow([timestamp, name, email, subject, message]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Click the 💾 **Save project** icon (or press `Ctrl + S`).

---

## Step 3: Deploy as a Web App

1. In the top right corner of Apps Script, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Portfolio Contact Form`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(⚠️ Important: Must be set to "Anyone" so visitors can send messages without logging in)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**:
   - Click **Authorize access**.
   - Select your Google account.
   - Click **Advanced** (at the bottom).
   - Click **Go to Untitled project (unsafe)**.
   - Click **Allow**.
6. Google will provide you with a **Web app URL** that looks like this:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. Click **Copy** to copy the URL.

---

## Step 4: Paste the URL into Your Portfolio

1. Open `js/main.js` in your portfolio folder.
2. At the top (line 10), locate:
   ```javascript
   const GOOGLE_SHEET_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` with your copied Web App URL:
   ```javascript
   const GOOGLE_SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Save the file!

---

## Step 5: Test It!

1. Open `index.html` in your browser.
2. Scroll to the **Get in Touch** section.
3. Fill in your name, email, subject, and message.
4. Click **Send Message**.
5. Check your Google Sheet — a new row will instantly appear with all details! 🎉
