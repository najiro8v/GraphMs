const axios = require("axios");
require("dotenv").config();
var prompt = require("prompt");
var userModel = require("./userModels.enum");
prompt.start();
/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */

let UsersList = [];
const endpoint = "https://graph.microsoft.com/v1.0/";
/***App's Calls ****/
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

async function GetIdUser(accessToken, ...values) {
  let valueUser;

  let usersRes = await callApi(accessToken);
  if (UsersList.length == 0) UsersList = usersRes.value;
  let users = UsersList;
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
        if (values.length > 0) {
          valueUser = {};
          values.forEach((e) => {
            valueUser[e] = users[parseInt(id)][e];
          });
        } else {
          valueUser = users[parseInt(id)]["id"];
        }
      }
    } while (!salir);
  }

  return valueUser;
}

async function sendEvent(accessToken) {
  idUser = await GetIdUser(accessToken);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  console.log("Correo de la persona a enviar evento");
  let { mail } = await GetIdUser(accessToken, userModel.Correo);
  const data = {
    subject: "Let's go for lunch",
    body: {
      contentType: "HTML",
      content: "Does late morning work for you?",
    },
    start: {
      dateTime: "2022-12-16T12:00:00",
      timeZone: "Pacific Standard Time",
    },
    end: {
      dateTime: "2022-12-16T14:00:00",
      timeZone: "Pacific Standard Time",
    },
    location: {
      displayName: "Harry's Bar",
    },
    attendees: [
      {
        emailAddress: {
          address: mail,
          name: "Harold",
        },
        type: "required",
      },
    ],
  };

  try {
    const response = await axios.default.post(
      `https://graph.microsoft.com/v1.0/users/${idUser}/calendar/events`,
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function sendEventsByCalendar(accessToken) {
  idUser = await GetIdUser(accessToken);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  // "Licitaciones"
  const idCalendar =
    "AAMkADM2ZmY4ZmI2LTE5NGMtNDIwNy05M2UyLTgwNzVmYzkzZjBjNgBGAAAAAACH8sNiNUxJRoTsm1iaGS3RBwAtT6tvPZG4RLdrQh9JUUN8AAAAAAEGAAAtT6tvPZG4RLdrQh9JUUN8AACXDNv_AAA=";
  console.log("Correo de la persona a enviar evento");
  let { mail, displayName } = await GetIdUser(
    accessToken,
    userModel.Correo,
    userModel.Nombre
  );
  const data = {
    subject: "Let's go for lunch",
    body: {
      contentType: "HTML",
      content: "Does late morning work for you?",
    },
    start: {
      dateTime: "2022-12-17T12:00:00",
      timeZone: "Pacific Standard Time",
    },
    end: {
      dateTime: "2022-12-17T14:00:00",
      timeZone: "Pacific Standard Time",
    },
    location: {
      displayName: "Harry's Bar",
    },
    attendees: [
      {
        emailAddress: {
          address: mail,
          name: displayName,
        },
        type: "required",
      },
    ],
  };
  try {
    const response = await axios.default.post(
      `https://graph.microsoft.com/v1.0/users/${idUser}/calendars/${idCalendar}/events`,
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getCalendar(accessToken) {
  idUser = await GetIdUser(accessToken);
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
      dateTime: "2022-12-16T12:00:00",
      timeZone: "Pacific Standard Time",
    },
    end: {
      dateTime: "2022-12-16T14:00:00",
      timeZone: "Pacific Standard Time",
    },
    location: {
      displayName: "Harry's Bar",
    },
    attendees: [
      {
        emailAddress: {
          address: "jzuniga@rdscr.com",
          name: "Harold",
        },
        type: "required",
      },
    ],
  };

  try {
    const response = await axios.default.get(
      `https://graph.microsoft.com/v1.0/users/${idUser}/calendars`,

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

async function getChannel(idTeam, accessToken) {
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

async function getChannels(accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };

  try {
    const response = await axios.default.get(`${endpoint}groups`, options);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/***************/
async function getDrive(accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
  idUser = await GetIdUser(accessToken);
  try {
    const path = "/drive/root:/Grabaciones/0006/0006.mp4";
    const response = await axios.default.get(
      `${endpoint}users/${idUser}${path}`,
      options
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
/***** */
//Migration Groups and channels
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

//*** Chat Messages ***/
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
/** Members**/
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

//** create groups**/
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

/**** User's Calls *****/
async function getMe(accessToken) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    };
    const response = await axios.default.get(
      "https://graph.microsoft.com/v1.0/me",
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function sendMessageUser(accessToken, msg) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    };
    const data = {
      body: {
        content: msg,
      },
    };
    const response = await axios.default.post(
      "https://graph.microsoft.com/v1.0/teams/aefe1e0f-2ca2-4a22-90ef-b9c4d852e6ac/channels/19%3aWd0G-oNKOIQl93I3GNs97QqHaUvbKtaBdpKh1UrOPLY1%40thread.tacv2/messages",
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function createEventUser(accessToken, EventName) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    };
    const data = {
      subject: EventName,
      start: {
        dateTime: "2022-07-11T05:08:10.570Z",
        timeZone: "UTC",
      },
      end: {
        dateTime: "2022-07-18T05:08:10.570Z",
        timeZone: "UTC",
      },
    };
    const response = await axios.default.post(
      "https://graph.microsoft.com/v1.0/me/events",
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/*** Exports ***/
module.exports = {
  getMe: getMe,
  getUsers: callApi,
  addMember: addMember,
  getChannel: getChannel,
  creatGroup: creatGroup,
  creatEvent: creatEvent,
  sendMessage: sendMessage,
  createTeams: createTeams,
  getChannels: getChannels,
  getMessages: getMessages,
  createChannel: createChannel,
  sendMessageUser: sendMessageUser,
  createEventUser: createEventUser,
  completeMigrationTeams: completeMigrationTeams,
  completeMigrationChannels: completeMigrationChannels,
  completeMigrationChannelG: completeMigrationChannelG,
  sendEvent: sendEventsByCalendar,
  getCalendar: getCalendar,
  getDrive: getDrive,
};
