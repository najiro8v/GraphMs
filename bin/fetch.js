const axios = require("axios");
const { createExternalChat } = require("../process");
require("dotenv").config();
var prompt = require("prompt");
prompt.start();
/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
const endpoint = "https://graph.microsoft.com/v1.0/";
async function callApi(accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const response = await axios.default.get(endpoint + "users", options);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function sendMessage(idTeam, idChannel, accessToken) {
  console.log("Escribre el mensaje que deseas mandar");
  const { msg } = await prompt.get(["msg"]);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  const data = {
    createdDateTime: "2019-02-04T19:58:15.511Z",
    from: {
      user: {
        id: "",
        displayName: "Joh Doe",
        userIdentityType: "aadUser",
      },
    },
    body: {
      contentType: "text",
      content: msg,
    },
  };

  try {
    const response = await axios.default.post(
      `${endpoint}teams/${idTeam}/channels/${idChannel}/messages`,
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function creatEvent(endpoint, accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };

  const data = {
    subject: "Let's go for lunch",
    body: {
      contentType: "HTML",
      content: "Does late morning work for you?",
    },
    start: {
      dateTime: "2019-06-15T12:00:00",
      timeZone: "Pacific Standard Time",
    },
    end: {
      dateTime: "2019-06-15T14:00:00",
      timeZone: "Pacific Standard Time",
    },
    location: {
      displayName: "Harry's Bar",
    },
    attendees: [
      {
        emailAddress: {
          address: "adelev@contoso.onmicrosoft.com",
          name: "Adele Vance",
        },
        type: "required",
      },
    ],
  };

  try {
    const response = await axios.default.post(
      "https://graph.microsoft.com/v1.0/teams",
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function createTeams(accessToken) {
  console.log("Coloca el nombre del Equipo ");
  const { name } = await prompt.get(["name"]);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  const data = {
    "@microsoft.graph.teamCreationMode": "migration",
    "template@odata.bind": `${endpoint}teamsTemplates('standard')`,
    displayName: name,
    description: `${name}s Description`,
    createdDateTime: "2020-03-14T11:22:17.043Z",
  };
  try {
    const response = await axios.default.post(
      `${endpoint}teams`,
      data,
      options
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function createChannel(idTeam, accessToken) {
  console.log("Coloca el nombre del canal ");
  const { name } = await prompt.get(["name"]);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  const data = {
    "@microsoft.graph.channelCreationMode": "migration",
    displayName: name,
    description:
      "This channel is where we debate all future architecture plans2",
    membershipType: "standard",
    createdDateTime: "2020-03-14T11:22:17.047Z",
  };
  try {
    const response = await axios.default.post(
      `${endpoint}teams/${idTeam}/channels`,
      data,
      options
    );
    response;
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getChannels(idTeam, accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  console.log("request made to web API at: " + new Date().toString());

  try {
    const response = await axios.default.get(
      `${endpoint}teams/${idTeam}/channels`,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function completeMigrationChannels(idTeam, idChannel, accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  try {
    const response = await axios.default.post(
      `${endpoint}teams/${idTeam}/channels/${idChannel}/completeMigration`, //Creado
      "",
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function completeMigrationChannelG(idTeam, accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  try {
    const channels = await getChannels(idTeam, accessToken);
    const idChannel = channels.value.filter(
      (channel) => channel.displayName === "General"
    )[0].id;
    const response = await axios.default.post(
      `${endpoint}teams/${idTeam}/channels/${idChannel}/completeMigration`, //general
      "",
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function completeMigrationTeams(idTeam, accessToken) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    };

    const response = await axios.default.post(
      `${endpoint}teams/${idTeam}/completeMigration`,
      "",
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getMessages(idTeam, idChannel, accessToken) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    };

    const response = await axios.default.get(
      `${endpoint}teams/${idTeam}/channels/${idChannel}/messages/`,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function addMember(idTeam, accessToken) {
  try {
    let idUser;
    let usersRes = await callApi(accessToken);
    let users = usersRes.value;
    if (users && users.length > 0) {
      console.log("Seleccione un usuario");
      let text = "";
      users.forEach((user, index) => {
        text += `#${index} : ${user.displayName} \t\t`;
        if (index % 3 === 0) {
          text += "\n";
        }
      });
      console.log(text);
      let salir = false;
      do {
        console.log("Escriba el numero del usuario");
        const { id } = await prompt.get(["id"]);
        if (parseInt(id) < users.length - 1 && parseInt(id) > -1) {
          salir = true;
          idUser = users[parseInt(id)].id;
        }
      } while (!salir);
    }

    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    };

    const data = {
      "@odata.type": "#microsoft.graph.aadUserConversationMember",
      roles: ["member"],
      "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${idUser}`,
    };

    const response = await axios.default.post(
      `https://graph.microsoft.com/v1.0/teams/${idTeam}/members`,
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function creatGroup(accessToken) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    };
    let usersRes = await callApi(accessToken);
    let users = usersRes.value;
    if (users && users.length > 0) {
      console.log("Seleccione un usuario");
      let text = "";
      users.forEach((user, index) => {
        text += `#${index} : ${user.displayName} \t\t`;
        if (index % 3 === 0) {
          text += "\n";
        }
      });
      console.log(text);
      let salir = false;
      do {
        console.log("Escriba el numero del usuario");
        const { id } = await prompt.get(["id"]);
        if (parseInt(id) < users.length - 1 && parseInt(id) > -1) {
          salir = true;
          idUser = users[parseInt(id)].id;
        }
      } while (!salir);
    }

    const data = {
      chatType: "group",
      members: [
        {
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          roles: ["owner"],
          "user@odata.bind":
            "https://graph.microsoft.com/v1.0/users('57d778cf-adfb-44d0-bd68-997cfa17f1b0')",
        },
        {
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          roles: ["guest"],
          "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${idUser}')`,
        },
      ],
    };

    const response = await axios.default.post(
      "https://graph.microsoft.com/v1.0/chats",
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
module.exports = {
  getUsers: callApi,
  sendMessage: sendMessage,
  creatEvent: creatEvent,
  createChannel: createChannel,
  getChannels: getChannels,
  completeMigrationChannels: completeMigrationChannels,
  completeMigrationTeams: completeMigrationTeams,
  getMessages: getMessages,
  addMember: addMember,
  createExternalChat: createExternalChat,
  createTeams: createTeams,
  completeMigrationChannelG: completeMigrationChannelG,
  creatGroup: creatGroup,
};
