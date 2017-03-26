const clientFactory = require('aws-api-gateway-client')
const config = require('../config.json')

const client = clientFactory.newClient({
  accessKey: config.accessKey,
  secretKey: config.secretKey,
  region: config.region,
  invokeUrl: config.invokeUrl
})

client
  .invokeApi(
    {
      uri: 'https://test-uri.com''
    },
    '',
    'GET',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      // queryParams: {
      //   uri: 'https://minghe.me',
      // }
    },
    {}
  )
  .then((res) => {
    if (res.status === 200) {
      console.log('data got: ', JSON.stringify(res.data, null, 2))
    } else {
      console.warn('error->', res.statusText)
    }
  })
  .catch((e) => {
    console.warn(e)
  })
