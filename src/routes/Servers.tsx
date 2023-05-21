import { useEffect, useState } from "react";
import "./servers.css";
import SelectMultiple from "../components/SelectMultiple";
import {
  getAllDiscordRoles,
  getAllGroups,
  getAllServersFromOwnerId,
  setAllServers,
} from "../utils/backend";
import {ReactComponent as DiscordChads} from '../discordchads.svg';
import styled from "styled-components";

type IServerSettings = {
  id: number;
  name: string;
  claims: IClaimsPerRole[];
};

export interface IClaimsPerRole {
  [key: string]: IServerClaim[];
}

export type IServerClaim = {
  id: string;
  name?: string;
  value?: number;
};

export type IServerOption = {
  value: string;
  label?: string;
};

function convertClaimToOption(claim: IServerClaim): IServerOption {
  return {
    value: claim.id,
    label: claim.name,
  };
}

function convertOptionToClaim(
  option: IServerOption,
  newValue: number
): IServerClaim {
  if (newValue > -1) {
    return {
      id: option.value,
      value: newValue,
    };
  } else {
    return {
      id: option.value,
    };
  }
}

const Header = styled.header`
  background-color: #2737e6;
  min-height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: calc(10px + 2vmin);
  padding: 0 2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;


const Servers: React.FC = () => {
  const [ownerId, setOwnerId] = useState<string>("0xFraye");

  const [servers, setServers] = useState<Array<IServerSettings>>([]);

  const [serverClaimsOption, setServerClaimsOption] = useState<IServerOption[]>(
    []
  );
  const [gitcoinValue, setGitcoinValue] = useState<number>(-1);

  const [discordRoles, setDiscordRoles] = useState<string[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showGitcoinValue, setShowGitcoinValue] = useState<boolean>(false);

  const [newServerName, setNewServerName] = useState<string>("");
  const [newServerRoles, setNewServerRoles] = useState<IClaimsPerRole[]>([]);
  const [newServerRole, setNewServerRole] = useState<string>("");
  const [selectedNewServerOption, setSelectedNewServerOption] = useState<
    IServerOption[]
  >([]);

  const [editServerId, setEditServerId] = useState<number | null>(null);

  const getServerGroups: () => Promise<IServerOption[]> = async () => {
    let groups = await getAllGroups();
    const options = groups.groups.map(convertClaimToOption);
    setServerClaimsOption(options);
    return options;
  };

  // onLoad get serverClaims and servers from backend
  useEffect(() => {
    getAllDiscordRoles().then(setDiscordRoles);
    getServerGroups();
    getAllServersFromOwnerId(ownerId).then(setServers);
  }, []);

  // handle show correct server in showEdit
  useEffect(() => {
    if (!!editServerId) {
      const editServer = servers.find((s) => s.id === editServerId);
      if (editServer == null) return;

      setNewServerName(editServer.name);
      setNewServerRoles(editServer.claims);
    }
  }, [servers, editServerId]);

  // handle show Gitcoin Passport value
  useEffect(() => {
    const isGitcoin = selectedNewServerOption.some(
      (s) => s.label === "gitcoin-passport-holders"
    );
    setShowGitcoinValue(isGitcoin);
  }, [selectedNewServerOption]);

  // handle filter roles
  // useEffect(() => {
  //   setFilteredRoles(
  //     discordRoles.filter((role) => !selectedRoles.includes(role))
  //   );
  // }, [discordRoles, selectedRoles]);

  const handleEditServer = (id: number) => {
    setEditServerId(id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setNewServerName("");
    setNewServerRole("");
    setEditServerId(null);
  };

  const handleSaveEditServer = () => {
    const newServers = servers.map((server) => {
      if (server.id === editServerId) {
        const newServerClaims: IServerClaim[] = selectedNewServerOption.map(
          (option) => convertOptionToClaim(option, gitcoinValue)
        );
        const foundClaim = server.claims.find(
          (claim: IClaimsPerRole) => claim[newServerRole]
        );

        if (foundClaim) {
          server.claims.find(
            (claim: IClaimsPerRole) => (claim[newServerRole] = newServerClaims)
          );
        } else {
          server.claims.push({ [newServerRole]: newServerClaims });
        }
      }
      return server;
    });
    setAllServers(ownerId, newServers);

    setNewServerName("");
    setNewServerRole("");
  };

  const handleSelectServerRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoles([...selectedRoles, e.target.value]);
    setNewServerRole(e.target.value);
  };

  return (
    <>
      <Header className="navbar">
        <div className="logo"><DiscordChads style={{width: "20%", height: "20%"}}/></div>
        <div className="user">
          Hi{" "}
          <span style={{ color: "red", textDecoration: "underline" }}>
            {ownerId}
          </span>
          !
        </div>
      </Header>
      <Container>
        <div className="servers">
          <h2>Here are your servers</h2>

          <table>
            <thead>
              <tr>
                <th>Server Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id}>
                  <tr>
                    <td>{server.name}</td>
                    <td>
                      <button
                        className="edit-server"
                        onClick={() => handleEditServer(server.id)}
                      >
                        Edit Server
                      </button>
                    </td>
                  </tr>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
      {showEditModal && !!editServerId ? (
          <>
            <div className="modal-content">
              <h3>Edit Server {newServerName}</h3>
              <div
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <label>Id: {editServerId}</label>
                <label>Server name: {newServerName}</label>

                <label>
                  Edit Claims with Server role:
                  <select onChange={handleSelectServerRole}>
                    {discordRoles.map((role) => (
                      <option value={role} key={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
                {showGitcoinValue && (
                  <label>
                    Gitcoin Passport value:
                    <input
                      type="number"
                      placeholder="10"
                      onChange={(e) => setGitcoinValue(+e.target.value)}
                      required={showGitcoinValue}
                    />
                  </label>
                )}
                <label>
                  Groups:
                  <SelectMultiple
                    options={serverClaimsOption}
                    selected={selectedNewServerOption}
                    setSelected={setSelectedNewServerOption}
                  />
                </label>
                <button onClick={handleSaveEditServer}>Save</button>
                <button onClick={handleCloseEditModal}>Cancel</button>
              </div>
            </div>
          </>
        ) : null}
    </>
  );
};

export default Servers;
