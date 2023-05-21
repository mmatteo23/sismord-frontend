import { useEffect, useState } from "react";
import "./servers.css";
import SelectMultiple from "../components/SelectMultiple";
import {
  getAllDiscordRoles,
  getAllGroups,
  getAllServersFromOwnerId,
  setAllServers,
} from "../utils/backend";

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
    getAllDiscordRoles().then((roles) => setDiscordRoles(roles));
    getServerGroups();
    getAllServersFromOwnerId(ownerId).then((servers) => setServers(servers));
  }, []);

  // handle show correct server in showEdit
  useEffect(() => {
    if (!!editServerId) {
      const editServer = servers.find((s) => s.id === editServerId);
      if (editServer == null) return;

      setNewServerName(editServer.name);
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
    // TODO test it
    const newServers = servers.map((server) => {
    
      if (server.id === editServerId) {
        const newServerClaims: IServerClaim[] = selectedNewServerOption.map((option) =>
          convertOptionToClaim(option, gitcoinValue)
        );
        const foundClaim = server.claims.find(
          (claim: IClaimsPerRole) => claim[newServerRole]
        );

        if (foundClaim) {
          server.claims.find(
            (claim: IClaimsPerRole) => claim[newServerRole] = newServerClaims
          );
        } else {
          server.claims.push({ [newServerRole]: newServerClaims });
        }
        // To test if returns modified server
        return server;
      } else {
        return server;
      }
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
      <h2> Hi! This is the Servers page</h2>
      <label>
        Owner Id:
        <input
          type="text"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
        />
      </label>
      {showEditModal && !!editServerId ? (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Server {newServerName}</h3>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
        </div>
      ) : null}

      <div>
        <h1>List of your Servers</h1>
        <div className="servers">
          <div className="server">
            {servers.map((server) => (
              <div key={server.id}>
                <div className="server-name">{server.name}</div>
                <button
                  className="edit-server"
                  onClick={() => handleEditServer(server.id)}
                >
                  Edit Server
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Servers;
