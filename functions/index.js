const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.weeklySeasonReset = functions.pubsub
  .schedule("0 0 * * 0") 
  .timeZone("Asia/Kolkata") 
  .onRun(async (context) => {
    
    // 1. Top 2 users ko find karein
    const leaderboardSnapshot = await db.collection("users")
      .orderBy("weeklyLikes", "desc")
      .limit(2)
      .get();

    if (leaderboardSnapshot.empty) return null;

    const winners = leaderboardSnapshot.docs;
    const batch = db.batch();

    // 2. Sabka purana status reset karein aur weeklyLikes 0 karein
    const allUsers = await db.collection("users").get();
    allUsers.forEach(doc => {
      batch.update(doc.ref, { 
        isSeasonWinner: false, 
        isSecondPlace: false,
        weeklyLikes: 0, 
        lastReset: admin.firestore.FieldValue.serverTimestamp() 
      });
    });

    // 3. Naye winners set karein (Sirf agar likes 0 se zyada ho)
    if (winners[0] && winners[0].data().weeklyLikes > 0) {
      batch.update(winners[0].ref, { isSeasonWinner: true });
    }
    if (winners[1] && winners[1].data().weeklyLikes > 0) {
      batch.update(winners[1].ref, { isSecondPlace: true });
    }

    await batch.commit();
    console.log("Season Reset Complete!");
    return null;
  });