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
    \t [2] Iniciar Sesión como usuario
    \t [3] GetDrive
    \t [0] Cerrar programa
    `);
      const { op } = await prompt.get(["op"]);

      switch (parseInt(op)) {
        case 1:
          await processOPC(process.getUsers, authResponse);
          break;
        case 2:
          await processOPC(process.getChannels, authResponse);

          break;
        case 3:
          await processOPC(process.CreateGroup, authResponse);
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

async function processOPC(cb, authResponse) {
  let user;
  try {
    users = await cb(authResponse.access_token);
  } catch (error) {
    console.error(error);
  } finally {
    return users;
  }
}
