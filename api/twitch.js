export default async function handler(req, res) {
  const { username } = req.query;

  const clientId = process.env.TWITCH_CLIENT_ID;
  const accessToken = process.env.TWITCH_ACCESS_TOKEN;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const twitchResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!twitchResponse.ok) {
      const errorData = await twitchResponse.json();
      return res.status(twitchResponse.status).json({ error: errorData });
    }

    const data = await twitchResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
