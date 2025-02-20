import { geRoomMetaData } from '@/utils/helpers';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { API } from '@huddle01/server-sdk/api';
export const dynamic = 'force-dynamic';

const createToken = async (
  roomId: string,
  role: string,
  displayName: string,
  walletAddress: string,
  avatarUrl: string,
) => {
  const accessToken = new AccessToken({
    apiKey: process.env.API_KEY as string,
    roomId: roomId as string,
    role: role,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    options: {
      metadata: {
        displayName,
        walletAddress,
        avatarUrl
      },
    },
  });

  const token = await accessToken.toJwt();

  return token;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const roomId = searchParams.get('roomId');
  const name = searchParams.get('name');
  const walletAddress = searchParams.get('walletAddress');
  const avatarUrl = searchParams.get('avatarUrl');
  let role;

  if (!roomId) {
    return new Response('Missing roomId', { status: 400 });
  }
  if (name === "boredhead") {
    role = Role.HOST;
  }
  else {
    try {
      const response = await fetch(
        `https://api.huddle01.com/api/v2/sdk/live-sessions/participants/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            'x-api-key': process.env.API_KEY!,
          },
        }
      );
      const data = await response.json();
      console.log(data, "data from live session");
      // Add logic to handle the response if needed

      if (data.count <= 2 || data.ok === false) {
        role = Role.SPEAKER;
      }
      else {
        role = Role.LISTENER;
      }
    }
    catch (error) {
      console.error("Error fetching room data:", error);
    }
  }

  let token: string;

  try {
    token = await createToken(
      roomId,
      role ?? Role.LISTENER,
      name ?? 'Guest',
      walletAddress ?? '',
      avatarUrl ?? '',
    );
  } catch (error) {
    console.error('Error :', error);
    token = await createToken(roomId, Role.LISTENER, name ?? 'Guest', walletAddress ?? '', avatarUrl ?? '');
  }

  console.log(token, "from the token route");

  return new Response(token, { status: 200 });
}