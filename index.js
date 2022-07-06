require("dotenv").config();
var prompt = require("prompt");
const auth = require("./bin/auth");
const process = require("./process");
let users = [],
  selecedUser = {};

async function main() {
  try {
    const authResponse = await auth.getToken(auth.tokenRequest);
    let exit = false;
    prompt.start();
    while (!exit) {
      console.log(`
    Menu\n
    \t [1] Obtener lista de usuarios
    \t [2] Crear un Grupo
    \t [3] Crear Canal con mensaje
    \t [0] Cerrar programa
    `);
      const { op } = await prompt.get(["op"]);

      switch (parseInt(op)) {
        case 1:
          try {
            users = await process.getUsers(authResponse.accessToken);
          } catch (error) {
            console.error(error);
          }
          break;
        case 2:
          try {
            await process.CreateGroup(authResponse.accessToken);
          } catch (error) {
            console.error(error);
          }
          break;
        case 3:
          try {
            await process.createExternalChat(authResponse.accessToken);
          } catch (error) {
            console.error(error);
          }
          break;
        case 4:
          try {
            await process.testo(authResponse.accessToken);
          } catch (error) {
            console.error(error);
          }
          break;
        case 0:
          exit = true;
          console.clear();
          console.log("Hasta luego");
          break;
        default:
          console.clear();
          console.log("Select a Graph operation first");
          break;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

main();
