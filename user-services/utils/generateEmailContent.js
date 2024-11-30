// reusable function for generating email content (HTML)
const generateEmailContent = (otp, logoUrl, shopName) => {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
            
            <!-- Shop Logo -->
            <img src="${logoUrl}" alt="Logo" style="display: block; margin: 0 auto 20px; max-width: 200px;" />
            
            <!-- Shop Name Heading (plain text, no link) -->
            <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">Welcome to ${shopName}!</h2>
            
            <!-- OTP Introduction Text -->
            <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;">
              To verify your email address, please use the following OTP (One Time Password):
            </p>
            
            <!-- OTP Display -->
            <h3 style="font-size: 30px; font-weight: bold; color: #007bff; margin-bottom: 20px;">${otp}</h3>
            
            <!-- OTP Expiry Warning -->
            <p style="font-size: 14px; color: #777; margin-bottom: 20px;">
              This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
            </p>
            
            <!-- Footer Section -->
            <footer style="font-size: 12px; color: #777; text-align: center; margin-top: 40px;">
              <p>&copy; ${new Date().getFullYear()} ${shopName}. All rights reserved.</p>
            </footer>
          </div>
        </body>
      </html>
    `;
  };
  
  module.exports = generateEmailContent;
  