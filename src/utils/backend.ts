import axios from 'axios';

const BASE_URL = 'http://localhost:3333/api/discord';

export const getAllDiscordRoles = async (serverId: string) => {
  const response = await axios.get(`${BASE_URL}/getDiscordRoles?serverId=${serverId}`);
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