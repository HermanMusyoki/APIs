require('dotenv').config();
const axios = require('axios');
const qs = require('qs');  // for form-encoded requests

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  SHORT_CODE,
  CONFIRMATION_URL,
  VALIDATION_URL
} = process.env;

async function getAccessToken() {
  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ZmpDdDdCVVlocXBMbHFKRVhoM21Qc2xQSEZxM0psUmNyOFVqeWsxRDZxeFBsdVZwOkdrSU5nM28yZ3d2ZGhBWkdHdW1mUGIxc1Q2ekZsS1FGdFBZQVN3cnZHRWJ6QkxmS05hU2NvdkNpb0ExRWlBNWI=`
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

async function registerC2BUrls() {
  const accessToken = await getAccessToken();
  const url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';

  const payload = {
    ShortCode: SHORT_CODE,
    ResponseType: "Completed",
    ConfirmationURL: CONFIRMATION_URL,
    ValidationURL: VALIDATION_URL
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Register URL Response:', response.data);
  } catch (error) {
    console.error('Error registering URLs:', error.response?.data || error.message);
  }
}

registerC2BUrls();
