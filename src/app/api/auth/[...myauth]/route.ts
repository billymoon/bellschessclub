import { jwtEncode } from "@/modules/jwt";
import { redirect } from "next/navigation";
import pkceChallenge from "pkce-challenge";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getUser } from "@/modules/sanity";

const client_id = "lichess-auth";

const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("user");
  redirect("/");
};

const login = async (redirect_uri: string) => {
  const challenge = await pkceChallenge();

  const authUrl = `https://lichess.org/oauth?${
    new URLSearchParams({
      redirect_uri,
      client_id,
      response_type: "code",
      code_challenge_method: "S256",
      code_challenge: challenge.code_challenge,
      // TODO: encrypt this or store in server state
      state: challenge.code_verifier,
      scope: "preference:read",
    }).toString()
  }`;

  redirect(authUrl);
};

type CallbackParams = {
  code: string;
  state: string;
};

const callback = async (
  redirect_uri: string,
  { code, state }: CallbackParams,
) => {
  const cookieStore = await cookies();

  const details = {
    code,
    grant_type: "authorization_code",
    code_verifier: state,
    redirect_uri,
    client_id,
  };

  let property: keyof typeof details;
  const formBody = [];
  for (property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  const { access_token, expires_in } = await fetch(
    `https://lichess.org/api/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody.join("&"),
    },
  ).then((r) => r.json());

  const expireDateTime = new Date(Date.now() + expires_in * 1000);
  const exp = Math.floor(
    expireDateTime.getTime() / 1000,
  );

  const account = await fetch("https://lichess.org/api/account", {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  }).then((r) => r.json());

  const user = await getUser(account.username);

  // await createUser(account.username, { team: "sandybells" });

  console.log({ exp, expires_in, expireDateTime });
  const jwt = jwtEncode(
    {
      username: account.username,
      isAdmin: Boolean(user?.isAdmin),
      isMember: Boolean(user),
      isGuest: !Boolean(user),
      exp,
    },
    {
      access_token,
      expires_in,
    },
  );

  cookieStore.set("user", jwt, { expires: expireDateTime });

  if (user) {
    redirect("/members");
  } else {
    redirect("/");
  }
};

export const GET = async (
  { url, headers }: NextRequest,
  { params }: { params: { myauth: [string] } },
) => {
  const {
    myauth: [action],
  } = await params;
  const { searchParams } = new URL(url);
  const queryParams = Object.fromEntries(Array.from(searchParams.entries()));

  const { origin } = new URL(
    `${headers.get("x-forwarded-proto")}://${headers.get("x-forwarded-host")}`,
  );
  const redirect_uri = `${origin}/api/auth/callback`;

  if (action === "logout") {
    return logout();
  } else if (action === "login") {
    return login(redirect_uri);
  } else if (action === "callback") {
    return callback(redirect_uri, queryParams as CallbackParams);
  } else {
    return Response.json({ origin, action, queryParams }, { status: 400 });
  }
};
