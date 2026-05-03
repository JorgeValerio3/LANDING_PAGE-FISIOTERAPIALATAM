const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../server/.env' });

async function testSMTP() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    console.log(`Testing SMTP for: ${emailUser}`);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP connection is successful!');
        
        // Optional: send a test mail to the same user
        /*
        await transporter.sendMail({
            from: emailUser,
            to: emailUser,
            subject: 'Test SMTP Connection',
            text: 'This is a test email to verify SMTP configuration.',
        });
        console.log('✅ Test email sent successfully!');
        */
    } catch (error) {
        console.error('❌ SMTP connection failed:');
        console.error(error);
    }
}

testSMTP();
