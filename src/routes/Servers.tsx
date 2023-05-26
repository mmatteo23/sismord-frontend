import { useEffect, useState } from "react";
import "./servers.css";
import SelectMultiple from "../components/SelectMultiple";
import {
  getAllDiscordRoles,
  getAllGroups,
  getAllServersFromOwnerId,
  setAllServers,
} from "../utils/backend";
import { ReactComponent as DiscordChads } from "../discordchads.svg";
import {
  IServerSettings,
  IClaimsPerRole,
  IServerClaim,
  IServerOption,
} from "./servers.types";
import { convertClaimToOption, convertOptionToClaim } from "../utils/servers";

const Servers: React.FC = () => {
  const [ownerId, setOwnerId] = useState<string>("0xFraye");

  const [servers, setServers] = useState<Array<IServerSettings>>([]);

  const [serverClaimsOption, setServerClaimsOption] = useState<IServerOption[]>(
    []
  );
  const [gitcoinValue, setGitcoinValue] = useState<number>(-1);

  const [discordServerId, setDiscordServerId] = useState<string>(
    "1091856489985093685"
  );
  const [showDiscordRoles, setShowDiscordRoles] = useState<boolean>(false);

  const [discordRoles, setDiscordRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
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
    getServerGroups();
    getAllServersFromOwnerId(ownerId).then(setServers);
  }, [ownerId]);

  useEffect(() => {
    getAllDiscordRoles(discordServerId).then(setDiscordRoles);
  }, [discordServerId]);

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

  const handleEditServer = (id: number) => {
    setEditServerId(id);
    setShowEditModal(true);
    setShowAddModal(false);
  };

  const handleAddServer = () => {
    setShowEditModal(false);
    setShowAddModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setNewServerName("");
    setNewServerRole("");
    setEditServerId(null);
  };

  const findReplaceClaim = (
    claims: IClaimsPerRole[],
    newClaims: IServerClaim[]
  ): IClaimsPerRole[] => {
    const claimIndex = claims.findIndex(
      (claim) => Object.keys(claim)[0] === newServerRole
    );
    if (claimIndex > -1) {
      claims[claimIndex][newServerRole] = newClaims;
    } else {
      claims.push({ [newServerRole]: newClaims });
    }
    return claims;
  };

  const handleSaveEditServer = () => {
    const newServers = servers.map((server) => {
      if (server.id === editServerId) {
        const newServerClaims: IServerClaim[] = selectedNewServerOption.map(
          (option) => convertOptionToClaim(option, gitcoinValue)
        );
        server.claims = findReplaceClaim(server.claims, newServerClaims);
      }
      return server;
    });
    setAllServers(ownerId, newServers);

    setNewServerName("");
    setNewServerRole("");
  };

  const handleSaveAddServer = () => {
    if (!!editServerId) {
      servers.push({
        id: editServerId,
        name: newServerName,
        claims: [],
      });
      const newServers = servers.map((server) => {
        if (server.id === editServerId) {
          const newServerClaims: IServerClaim[] = selectedNewServerOption.map(
            (option) => convertOptionToClaim(option, gitcoinValue)
          );
          server.claims = findReplaceClaim(server.claims, newServerClaims);
        }
        return server;
      });
      setAllServers(ownerId, newServers);

      setNewServerName("");
      setNewServerRole("");
    }
  };

  const handleSelectServerRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoles([...selectedRoles, e.target.value]);
    setNewServerRole(e.target.value);
  };

  const getGroupNameFromId = (id: string) => {
    const group = serverClaimsOption.find((option) => option.value === id);
    return group?.label;
  };

  const handleDiscordServerId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscordServerId(e.target.value);
    setShowDiscordRoles(true);
  };

  return (
    <>
      <div className="header flexed_row">
        <div className="logo">
          <DiscordChads style={{ width: "40%", height: "40%" }} />
        </div>
        <div className="user">
          Hi <span className="ownerId">{ownerId}</span>!
        </div>
      </div>
      <div className="container">
        <div className="container_content">
          <div className="flexed_row">
            <h2>Here are your servers</h2>
            <button className="add_server" onClick={handleAddServer}>
              Add new
            </button>
          </div>

          <div className="servers_list">
            {servers.map((server, index) => (
              <div key={server.id} className="flexed_row server">
                <div>
                  <span>#{index + 1}</span>
                  <h2>{server.name}</h2>
                </div>
                <button
                  className="edit_server"
                  onClick={() => handleEditServer(server.id)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEditModal && !!editServerId ? (
        <div className="container">
          <div className="container_content">
            <h3>Edit Server {newServerName}</h3>
            <form className="edit_server_form" onSubmit={handleSaveEditServer}>
              <p>
                <strong>Id:</strong> <code>{editServerId}</code>
              </p>
              <p>
                <strong>Server name:</strong> {newServerName}
              </p>
              <br />

              <div className="flexed_col">
                <div className="flexed_row_og">
                  <p>
                    Edit Group Claims for this server <strong>role</strong>:
                  </p>
                  <select
                    onChange={handleSelectServerRole}
                    className="select_roles"
                    required
                  >
                    {discordRoles.map((role) => (
                      <option value={role} key={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                {showGitcoinValue && (
                  <div className="flexed_row_og">
                    Gitcoin Passport value:
                    <input
                      type="number"
                      placeholder="10"
                      onChange={(e) => setGitcoinValue(+e.target.value)}
                      required={showGitcoinValue}
                      className="select_gitcoin"
                    />
                  </div>
                )}

                <div style={{ color: "black" }}>
                  <span style={{ color: "white" }}>Groups:</span>
                  <SelectMultiple
                    options={serverClaimsOption}
                    selected={selectedNewServerOption}
                    setSelected={setSelectedNewServerOption}
                  />
                </div>
              </div>

              <div>
                <h3>Current Roles and Claims</h3>
                {newServerRoles.map((claim: IClaimsPerRole) => {
                  const role = Object.keys(claim)[0];
                  const claims = claim[role];
                  return (
                    <div key={role}>
                      <div className="flexed_row">
                        <div>
                          Role: <strong>{role}</strong>
                        </div>
                        <div>
                          {claims.map((claim: IServerClaim) => (
                            <div key={claim.id} className="flexed_col">
                              <div>
                                <strong>{getGroupNameFromId(claim.id)}</strong>
                              </div>
                              <code>{claim.id}</code>
                              <div>
                                Group value: <span>{claim.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>

              <div className="flexed_row" style={{ margin: "1em 0" }}>
                <button type="submit" className="submit_btn">
                  SAVE
                </button>
                <button onClick={handleCloseEditModal} className="cancel_btn">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {showAddModal ? (
        <div className="container">
          <div className="container_content">
            <h3>Add new Server {newServerName}</h3>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: "0.8em",
              }}
              onSubmit={handleSaveAddServer}
            >
              <p>
                <strong>Id:</strong>{" "}
                <input
                  type="number"
                  onChange={(e) => setEditServerId(+e.target.value)}
                  className="bordered"
                />
              </p>
              <p>
                <strong>Server name:</strong>
                <input
                  type="string"
                  onChange={(e) => setNewServerName(e.target.value)}
                  style={{
                    padding: "0.4em",
                    border: "0px",
                    borderRadius: "16px",
                  }}
                />
              </p>

              <div className="flexed_col">
                <div className="flexed_row_og">
                  {showDiscordRoles ? (
                    <>
                      <p>
                        Edit Group Claims for this server <strong>role</strong>:
                      </p>
                      <select
                        onChange={handleSelectServerRole}
                        className="bordered"
                        required={showDiscordRoles}
                      >
                        {discordRoles.map((role) => (
                          <option value={role} key={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <p>Add your Discord Server id to pull roles</p>
                      <input
                        type="string"
                        placeholder="discord server id"
                        onChange={handleDiscordServerId}
                        required={!showDiscordRoles}
                        className="bordered"
                      />
                    </>
                  )}
                </div>
                {showGitcoinValue && (
                  <div className="flexed_row_og">
                    Gitcoin Passport value:
                    <input
                      type="number"
                      placeholder="10"
                      onChange={(e) => setGitcoinValue(+e.target.value)}
                      required={showGitcoinValue}
                      className="select_gitcoin"
                    />
                  </div>
                )}

                <div style={{ color: "black" }}>
                  <span style={{ color: "white" }}>Groups:</span>
                  <SelectMultiple
                    options={serverClaimsOption}
                    selected={selectedNewServerOption}
                    setSelected={setSelectedNewServerOption}
                  />
                </div>
              </div>

              <div>
                <h3>Current Roles and Claims</h3>
                {newServerRoles.map((claim: IClaimsPerRole) => {
                  const role = Object.keys(claim)[0];
                  const claims = claim[role];
                  return (
                    <div key={role}>
                      <div key={role} className="flexed_row">
                        <div>
                          Role: <strong>{role}</strong>
                        </div>
                        <div>
                          {claims.map((claim) => (
                            <div key={claim.id} className="flexed_col">
                              <div>
                                <strong>{getGroupNameFromId(claim.id)}</strong>
                              </div>
                              <code>{claim.id}</code>
                              <div>
                                Group value: <span>{claim.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>

              <div className="flexed_row" style={{ margin: "1em 0" }}>
                <button type="submit" className="submit_btn">
                  SAVE
                </button>
                <button onClick={handleCloseEditModal} className="cancel_btn">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Servers;
