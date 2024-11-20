import { CronJob } from "cron";
import https from "https";

const URL = "https://fars-v1.onrender.com/";

const job = new CronJob("*/14 * * * *", function () {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    })
    .on("error", (e) => {
      console.error("Error while sending request", e);
    });
});

// const startTime = new Date();
// startTime.setDate(startTime.getDate() + 1); // Tomorrow
// startTime.setHours(10, 0, 0, 0); // 10:00 AM

// const job = new CronJob(
//   "*/14 * * * *", // Every 14 minutes
//   () => {
//     const now = new Date();
//     if (now >= startTime) {
//       https
//         .get(URL, (res) => {
//           if (res.statusCode === 200) {
//             console.log("GET request sent successfully");
//           } else {
//             console.log("GET request failed", res.statusCode);
//           }
//         })
//         .on("error", (e) => {
//           console.error("Error while sending request", e);
//         });
//     } else {
//       console.log("Waiting until tomorrow at 10:00 AM to start the job.");
//     }
//   },
//   null, // No onComplete callback
//   true // Start the job immediately
// );

export default job;
