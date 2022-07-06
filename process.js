const fetch = require("./bin/fetch");
var prompt = require("prompt");
prompt.start();
let idTeams = [];
async function getUsers(token) {
  await fetch
    .getUsers(token)
    .then((res) => {
      let users = res.value;
      if (users && users.length > 0) {
        console.log("lista de usuarios");
        console.group();
        users.forEach((user, index) => {
          console.log(`#${index} : ${user.displayName}`);
        });
        console.groupEnd();
      }
      return users;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function createExternalChat(token) {
  let teamId, idChannel;

  await fetch
    .createTeams(token)
    .then(async (res) => {
      console.log("Equipo Creado");
      teamId = res.headers["content-location"].split("('")[1];
      teamId = teamId.substring(0, teamId.length - 2);
      idTeams.push(teamId);
      return await fetch.createChannel(teamId, token);
    })
    .then(async (res) => {
      console.log("Canal creado");

      idChannel = res.data.id;
      return await fetch.sendMessage(teamId, idChannel, token);
    })
    .then(async (res) => {
      console.log("Mensaje enviado");

      return await fetch.completeMigrationChannels(teamId, idChannel, token);
    })
    .then(async (res) => {
      //General Channel
      return await fetch.completeMigrationChannelG(teamId, token);
    })
    .then(async (res) => {
      return await fetch.completeMigrationTeams(teamId, token);
    })
    .then(async (res) => {
      console.log("Equipo y canales completado");
      return await fetch.addMember(teamId, token);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function CreateGroup(token) {
  await await fetch
    .creatGroup(authResponse.accessToken)
    .then((res) => {
      console.log("Grupo creado y miembro agregado");
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function testo(token) {
  return await fetch.addMember("463ce730-85da-48e6-864a-6ceb5fcca744", token);
}
module.exports = {
  getUsers: getUsers,
  createExternalChat: createExternalChat,
  CreateGroup: CreateGroup,
  testo: testo,
};
