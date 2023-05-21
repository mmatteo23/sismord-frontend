import axios from 'axios';

const BASE_URL = 'http://localhost:3333/api/discord';

export const getAllDiscordRoles = async () => {
  // TODO remove hardcoded serverId
  const response = await axios.get(`${BASE_URL}/getDiscordRoles?serverId=1091856489985093685`);
  return response.data;
};

export const getAllServersFromOwnerId = async (ownerId: string) => {
  const response = await axios.get(`${BASE_URL}/getServersByOwner?owner=${ownerId}`);
  return response.data;
};

export const getAllGroups = async () => {
  const response = await axios.get(`${BASE_URL}/getAllGroups`);
  return response.data;
}

export const setAllServers = async (ownerId: string, servers: any) => {
  const response = await axios.post(`${BASE_URL}/setServer`, {
    owner: ownerId,
    servers
  });
  return response.data;
}