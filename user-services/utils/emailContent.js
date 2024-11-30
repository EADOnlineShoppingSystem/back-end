// emailContent.js

const emailContent = (shopName, logoUrl) => {
    return `
      <html>
        <head>
          <style>
            /* Add any custom styling here */
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
            }
            .email-header img {
              width: 150px; /* Adjust the size of the logo */
            }
            .email-body {
              margin-top: 20px;
              font-size: 16px;
              line-height: 1.6;
            }
            .email-footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img src="${logoUrl}" alt="${shopName} Logo" />
              <h2>We're sorry to see you go!</h2>
            </div>
            <div class="email-body">
              <p>We wanted to confirm that your account has been successfully deleted from our system. If you did not request this action, please get in touch with us immediately.</p>
              <p>Your feedback is important to us. If you have any suggestions or concerns, feel free to contact our support team.</p>
              <p>Thank you for being part of ${shopName}, and we wish you all the best in the future.</p>
            </div>
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} ${shopName}. All rights reserved.</p>
              <p>Visit our <a href="https://www.yourshopwebsite.com">website</a> for more details.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };
  
  module.exports = emailContent;
  