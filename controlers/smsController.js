const accountSid = "AC2f956c709c97ea10686cc5201b11f744";
const authToken = "ac623fa9a5ae3cfc98cd7846b2acd6f4";
const verifySid = "VA3863645b535b119bd77ef56706d1c3c3";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+50670982247", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+50670982247", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });