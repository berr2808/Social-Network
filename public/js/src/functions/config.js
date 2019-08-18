const AppConfig = {
  BRANDNAME: process.env.BRANDNAME || '(K)-UCA',
  PORT:process.env.PORT ||8080,
  HOST: process.env.HOST || "https://localhost:3000",
  API: process.env.API || "https://main20190810065704.azurewebsites.net/api/",
  MAIL: process.env.MAIL_PASSWORD || "correo@correo.com",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "password",
  SESSION_SECRET_LETTER: process.env.SESSION_SECRET_LETTER || "secret-session-001",
}

module.exports={ AppConfig};
