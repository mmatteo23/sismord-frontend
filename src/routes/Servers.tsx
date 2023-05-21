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
  min-height: 10vh;
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  align-content: middle;
  color: black;
  font-size: calc(10px + 2vmin);
  padding: 0 2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #5865f2;
  max-width: 80vw;
  margin: 2em auto;
  padding: 1em;
  border-radius: 16px;
  color: white;
`;

const ContainerContent = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 0 auto;
  margin-bottom: 2em;
  border: 1px solid #000;
`;

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
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
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

  // handle filter roles
  // useEffect(() => {
  //   setFilteredRoles(
  //     discordRoles.filter((role) => !selectedRoles.includes(role))
  //   );
  // }, [discordRoles, selectedRoles]);

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
          const foundClaim = server.claims.find(
            (claim: IClaimsPerRole) => claim[newServerRole]
          );

          if (foundClaim) {
            server.claims.find(
              (claim: IClaimsPerRole) =>
                (claim[newServerRole] = newServerClaims)
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
      <Header className="navbar">
        <div className="logo">
          <DiscordChads style={{ width: "20%", height: "20%" }} />
        </div>
        <div className="user">
          Hi{" "}
          <span style={{ color: "red", textDecoration: "underline" }}>
            {ownerId}
          </span>{" "}
          !
        </div>
      </Header>
      <Container>
        <ContainerContent className="servers">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <h2>Here are your servers</h2>
            <button
              style={{
                padding: "1.2em",
                border: "0px",
                borderRadius: "16px",
                backgroundColor: "green",
                color: "white",
                cursor: "pointer",
              }}
              onClick={handleAddServer}
            >
              Add new
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {servers.map((server, index) => (
              <div
                key={server.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "0.8em 0",
                  padding: "0 1.2em",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <div>
                  <span>#{index + 1}</span>
                  <h2>{server.name}</h2>
                </div>
                <button
                  style={{
                    marginRight: "0.4em",
                    padding: "1.2em",
                    borderRadius: "16px",
                    border: "0px",
                    backgroundColor: "#E17E0D",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEditServer(server.id)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </ContainerContent>
      </Container>
      {showEditModal && !!editServerId ? (
        <Container>
          <ContainerContent className="modal-content">
            <h3>Edit Server {newServerName}</h3>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
              onSubmit={handleSaveEditServer}
            >
              <p>
                <strong>Id:</strong> <code>{editServerId}</code>
              </p>
              <p>
                <strong>Server name:</strong> {newServerName}
              </p>
              <br />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1em",
                  }}
                >
                  <p>
                    Edit Group Claims for this server <strong>role</strong>:
                  </p>
                  <select
                    onChange={handleSelectServerRole}
                    style={{
                      padding: "0.4em",
                      border: "0px",
                      borderRadius: "16px",
                    }}
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "1em",
                    }}
                  >
                    Gitcoin Passport value:
                    <input
                      type="number"
                      placeholder="10"
                      onChange={(e) => setGitcoinValue(+e.target.value)}
                      required={showGitcoinValue}
                      style={{
                        padding: "0.4em",
                        border: "0px",
                        borderRadius: "16px",
                      }}
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          Role: <strong>{role}</strong>
                        </div>
                        <div>
                          {claims.map((claim: IServerClaim) => (
                            <div
                              key={claim.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "0.2em",
                              }}
                            >
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "1em 0",
                }}
              >
                <button
                  type="submit"
                  style={{
                    width: "45%",
                    padding: "1.2em",
                    backgroundColor: "green",
                    border: "0px solid ",
                    borderRadius: "16px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  SAVE
                </button>
                <button
                  onClick={handleCloseEditModal}
                  style={{
                    width: "45%",
                    padding: "1.2em",
                    backgroundColor: "red",
                    border: "0px solid",
                    borderRadius: "16px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </ContainerContent>
        </Container>
      ) : null}
      {showAddModal ? (
        <Container>
          <ContainerContent className="modal-content">
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
                  style={{
                    padding: "0.4em",
                    border: "0px",
                    borderRadius: "16px",
                  }}
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1em",
                  }}
                >
                  {showDiscordRoles ? (
                    <>
                      <p>
                        Edit Group Claims for this server <strong>role</strong>:
                      </p>
                      <select
                        onChange={handleSelectServerRole}
                        style={{
                          padding: "0.4em",
                          border: "0px",
                          borderRadius: "16px",
                        }}
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
                        style={{
                          border: "0px",
                          borderRadius: "16px",
                        }}
                      />
                    </>
                  )}
                </div>
                {showGitcoinValue && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "1em",
                    }}
                  >
                    Gitcoin Passport value:
                    <input
                      type="number"
                      placeholder="10"
                      onChange={(e) => setGitcoinValue(+e.target.value)}
                      required={showGitcoinValue}
                      style={{
                        padding: "0.4em",
                        border: "0px",
                        borderRadius: "16px",
                      }}
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
                      <div
                        key={role}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          Role: <strong>{role}</strong>
                        </div>
                        <div>
                          {claims.map((claim: IServerClaim) => (
                            <div
                              key={claim.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "0.2em",
                              }}
                            >
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "1em 0",
                }}
              >
                <button
                  type="submit"
                  style={{
                    width: "45%",
                    padding: "1.2em",
                    backgroundColor: "green",
                    border: "0px solid ",
                    borderRadius: "16px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  SAVE
                </button>
                <button
                  onClick={handleCloseEditModal}
                  style={{
                    width: "45%",
                    padding: "1.2em",
                    backgroundColor: "red",
                    border: "0px solid",
                    borderRadius: "16px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </ContainerContent>
        </Container>
      ) : null}
    </>
  );
};

export default Servers;
