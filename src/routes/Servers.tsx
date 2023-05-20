import { useEffect, useState } from "react";
import "./servers.css";
import SelectMultiple from "../components/SelectMultiple";

/*TODO
Backend
1. use hard-coded guild.id to get server roles https://discord.com/developers/docs/resources/guild#get-guild-roles
2. from discord api get roles and if newRole is not there add it
3. get list of user guilds and choose one of the servers where you're the owner https://discord.com/developers/docs/resources/user#get-current-user-guilds
4. add Discord OAuth2 https://discordjs.guide/oauth2/#a-quick-example

UPDATE GIUSTO
1. get set gruppi
*/

type IServer = {
  id: number;
  name: string;
  roles: string[];
  claims: IClaim[];
};

export type IClaim = {
  value: string;
  label: string;
};

const Servers: React.FC = () => {
  const [servers, setServers] = useState<Array<IServer>>([]);
  const [serverClaims, setServerClaims] = useState<IClaim[]>([]);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showGitcoinValue, setShowGitcoinValue] = useState<boolean>(false);

  const [newServerName, setNewServerName] = useState<string>("");
  const [newServerRole, setNewServerRole] = useState<string>("");
  const [selectedNewServerClaim, setSelectedNewServerClaim] = useState<
    IClaim[]
  >([]);

  const [editServerId, setEditServerId] = useState<number | null>(null);
  const [editServerRoles, setEditServerRoles] = useState<string[]>([]);

  // onLoad get serverClaims and servers from backend
  useEffect(() => {
    const initClaims: IClaim[] = [
      {
        value: "0x1cde61966decb8600dfd0749bd371f12",
        label: "Gitcoin Passport",
      },
      {
        value: "0x666",
        label: "Gesu cane",
      },
      {
        value: "0xFFF",
        label: "White",
      },
      {
        value: "0x000",
        label: "GOD",
      },
    ];

    setServerClaims(initClaims);

    // TODO save servers to backend correctly
    setServers([
      {
        id: 1,
        name: "Server 1",
        roles: ["chad", "dio", "tre", "quattro"],
        claims: [{
          value: "",
          label: "",
        }],
      },
    ]);
  }, []);

  // handle show correct server in showEdit 
  useEffect(() => {
    if (!!editServerId) {
      const editServer = servers.find((s) => s.id === editServerId);
      if (editServer == null) return;

      setNewServerName(editServer.name);
      setEditServerRoles(editServer.roles);
    }
  }, [servers, editServerId]);

  // handle show Gitcoin Passport value
  useEffect(() => {
    const isGitcoin = selectedNewServerClaim.some(
      (s) => s.label === "Gitcoin Passport"
    );
    setShowGitcoinValue(isGitcoin);
  }, [selectedNewServerClaim]);

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
    // call sismord-bot API to update role with newServerRole and newServerClaim
    console.log(newServerRole, selectedNewServerClaim);

    setShowEditModal(false);
    setNewServerName("");
    setNewServerRole("");
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setNewServerRole(e.target.value);
  };

  return (
    <>
      {showEditModal && !!editServerId ? (
        <div className="modal">
          <div className="modal-content">
            <h3>
              Edit Server <h2>{newServerName}</h2>{" "}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <label>Id: {editServerId}</label>
              <label>Server name: {newServerName}</label>
              <label>
                Bot role:
                <select onChange={handleRoleChange}>
                  {editServerRoles.map((role) => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              {showGitcoinValue && (
                <label>
                  Gitcoin Passport value:
                  <input type="number" placeholder="1" />
                </label>
              )}
              <label>
                Claims:
                <SelectMultiple
                  options={serverClaims}
                  selected={selectedNewServerClaim}
                  setSelected={setSelectedNewServerClaim}
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
