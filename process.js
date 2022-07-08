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
    .creatGroup(token)
    .then((res) => {
      console.log("Grupo creado y miembro agregado");
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function testo(token) {

  let selectedTeam=idTeams.length<=0?"e6ac3150-e89e-4f7a-abf2-1cec263908aa":"none";
  if("none"===selectedTeam){
    console.log("Selecciona un grupo");
    idTeams.forEach((channel,index)=>{
      console.log(`#${index} id: ${channel.id} | name: ${channel.displayName} |`)
    })
    const { pos } = await prompt.get(["pos"]);
    selectedTeam=idTeams[parseInt(pos)].id
  }
  
  return await fetch.addMember(selectedTeam, token);
}

async function getChannels(token){
  let teams=[];
  return await fetch.getChannels(token).then(res=>{
    res.value.forEach(channel => {
      if(channel.displayName.toUpperCase().startsWith("TEST")){
        console.log(`id: ${channel.id} | name: ${channel.displayName} |`)
        teams.push(channel)
      }
    });
    idTeams = [...teams];
  }).catch(error=>console.log(error));
}
module.exports = {
  getUsers: getUsers,
  createExternalChat: createExternalChat,
  CreateGroup: CreateGroup,
  testo: testo,
  getChannels:getChannels,
};
