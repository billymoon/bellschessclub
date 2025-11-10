// @ts-nocheck
import Fiona from "fiona";

Fiona.register([
  "rating",
  (seeded) => seeded.bool({ chance: .2}) ? 0 : seeded.number({ min: 500, max: 2500 }),
]);

Fiona.register([
  "document",
  (seeded, overrides) =>
    seeded.object({
      _createdAt: Fiona.Date({ long: true }),
      _id: Fiona.Regex(
        /(?:[0-9a-f]){8}-(?:[0-9a-f]){4}-(?:[0-9a-f]){4}-(?:[0-9a-f]){4}-(?:[0-9a-f]){12}/i,
      ),
      _rev: Fiona.Regex(/[a-zA-Z0-9]{22}/),
      _type: "member",
      _updatedAt: Fiona.Date({ long: true }),
      ...overrides,
    }),
]);

Fiona.register([
  "member",
  (seeded, overrides) =>
    seeded.document({
      active: Fiona.Bool({ chance: 0.9 }),
      allegroLive: Fiona.Rating,
      allegroPublished: Fiona.Rating,
      chesscomUsername: Fiona.Gibberish({ qty: 1 }),
      isAdmin: false,
      lichessUsername: Fiona.Gibberish({ qty: 1 }),
      name: (seeded) => `${seeded.firstname()} ${seeded.surname()}`,
      pnum: Fiona.Number({ min: 10000, max: 99999 }),
      standardLive: Fiona.Rating,
      standardPublished: Fiona.Rating,
      username: (seeded) => seeded.data.lichessUsername,
      ...overrides,
    }),
]);

const memberInserts = Fiona(1)
  .array(10, (seeded) => seeded.document(seeded.member()))
  .map(
    ({ _createdAt, _updatedAt, _id, _rev, _type, ...data }) =>
      `INSERT INTO documents VALUES('${_id}','${_rev}','${_createdAt}','${_updatedAt}','${_type}','${JSON.stringify(data)}');`,
  );

let firstrun = true;
export const db = async (turso) => {
  if (!process.env.TURSO_URL && firstrun) {
    await turso.batch([
      `CREATE TABLE documents (
        _id TEXT PRIMARY KEY NOT NULL,
        _rev TEXT,
        _createdAt TEXT,
        _updatedAt TEXT,
        _type TEXT,
        data TEXT
    );`,
      ...memberInserts,
      `INSERT INTO documents VALUES('910238f4-4fe6-40ff-aef3-291930e78ef2','aGpldou8uDCYtULGTNTS1L','2025-09-29T00:01:24Z','2025-10-08T16:57:28Z','member','{"active":true,"allegroLive":1851,"allegroPublished":0,"chesscomUsername":null,"isAdmin":true,"lichessUsername":"krowmedy","name":"Rohit the IT guy","pnum":"32430","standardLive":1462,"standardPublished":0,"username":"krowmedy"}');`,
      `INSERT INTO documents VALUES('333db2e0-037a-42f3-85c0-c54f45bf0c6f','vXmjOX73zE719thP5bUaKz','2025-09-29T00:01:24Z','2025-10-13T20:48:24Z','member','{"active":true,"allegroLive":1545,"allegroPublished":1545,"chesscomUsername":"billy_moon","isAdmin":true,"lichessUsername":"billymoon","name":"Billy the IT guy","pnum":29439,"standardLive":1523,"standardPublished":1541,"username":"billymoon"}');`,
      `INSERT INTO documents VALUES('bd640bc6-a7e4-49f1-a5a8-128a25564310','aGpldou8uDCYtULGTNTS1L','2025-09-29T00:01:24Z','2025-10-08T21:16:40Z','member','{"active":true,"allegroLive":0,"allegroPublished":0,"chesscomUsername":"flyingtrain","isAdmin":true,"lichessUsername":"flyingTrain","name":"Alex the IT guy","pnum":32502,"standardLive":0,"standardPublished":0,"username":"flyingTrain"}');`,
      `INSERT INTO documents VALUES('6990a8dc-3089-4d33-89a6-64ed0d86a869','aGpldou8uDCYtULGTNTS1L','2025-09-29T00:01:24Z','2025-10-12T12:12:56Z','member','{"active":true,"allegroLive":1065,"allegroPublished":1065,"chesscomUsername":"","isAdmin":false,"lichessUsername":"Mike_Wallace_18","name":"Mike the IT guy","pnum":9443,"standardLive":1264,"standardPublished":1264,"username":"Mike_Wallace_18"}');`,
      `INSERT INTO documents VALUES('842d9b1f-fc77-47d2-b43d-7afddcf54eb2','aGpldou8uDCYtULGTLVTTP','2025-10-08T17:34:23Z','2025-10-08T17:57:26Z','match','{"players":[],"date":"2026-01-28T19:00:00.000Z","isAtHome":true,"opponent":"Teamy McTeamface","team":2,"venue":"Some random away venue"}');`,
      `INSERT INTO documents VALUES('b77a9570-9115-4826-9446-95f02b4b691b','aGpldou8uDCYtULGTLVTTP','2025-10-08T17:34:23Z','2025-10-08T17:57:26Z','match','{"players":[],"date":"2026-01-15T19:15:00.000Z","isAtHome":true,"opponent":"Clubby McClubface","team":1,"venue":"Mayfield Bowling Club"}');`,
      `INSERT INTO documents VALUES('4b3224c0-5375-46fb-9a57-8f79e43b3791','aGpldou8uDCYtULGTM5ONX','2025-10-09T13:42:33Z','2025-10-09T13:42:33Z','allegro','{"players":[],"date":"2025-12-13T19:30:00.000Z","opponents":["Clubby McClubface","Teamy McTeamface"]}');`,
    ]);
  }
  firstrun = false;
};
