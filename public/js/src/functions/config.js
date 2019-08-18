const AppConfig = {
  BRANDNAME: process.env.BRANDNAME || '(K)-UCA',
  PORT:process.env.PORT ||8080,
  HOST: process.env.HOST || "http://ec2-18-205-27-185.compute-1.amazonaws.com",
  API: process.env.API || "https://main20190810065704.azurewebsites.net/api/",
  MAIL: process.env.MAIL_PASSWORD || "byronrochaxxx@gmail.com",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "Managua1997",
  SESSION_SECRET_LETTER: process.env.SESSION_SECRET_LETTER || "secret-session-001",
}

module.exports={ AppConfig};
