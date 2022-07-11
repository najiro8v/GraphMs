require("dotenv").config();
var prompt = require("prompt");
const auth = require("./bin/auth");
const auth_User = require("./bin/auth_User");
const process = require("./process");

async function main() {
  try {
    const authResponse = await auth.getToken(auth.tokenRequest);
    let exit = false;
    prompt.start();

    while (!exit) {
      console.log(`
    Menu\n
    \t [1] Obtener lista de usuarios
    \t [2] Obtener lista de canales
    \t [3] Crear un Grupo
    \t [4] Crear Canal con mensaje
    \t [5] Iniciar Sesión como usuario
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
            await process.getChannels(authResponse.accessToken);
          } catch (error) {
            console.error(error);
          }
          break;
        case 3:
          try {
            await process.CreateGroup(authResponse.accessToken);
          } catch (error) {
            console.error(error);
          }
          break;
        case 4:
          try {
            await process.createExternalChat(authResponse.accessToken);
          } catch (error) {
            console.error(error);
          }
          break;
        case 5:
          try {
            await process.Menu_User(await auth_User.login());
            console.log("En proceso :3");
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
          console.log("Seleccione una opción valida");
          break;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

main();
