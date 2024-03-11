const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
const inquirer = require("inquirer");

var caminhoUsuario;
var usuario;

var voltarMenuPrincipal;

function run(username, funcaoMenuPrincipal) {
  const caminho = path.join("contas", username + ".json");

  if (fs.existsSync(caminho)) {
    caminhoUsuario = caminho;
    usuario = username;
    voltarMenuPrincipal = funcaoMenuPrincipal;
    dashboard();
  } else {
    throw new Exception("Usuário não existe!");
  }
}

function dashboard() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "opcao",
        message: "Selecione a opção desejada:",
        choices: ["Consultar Saldo", "Depositar", "Sacar", "Sair"],
      },
    ])
    .then((respostas) => {
      const resp = respostas["opcao"];

      if (resp === "Consultar Saldo") {
        consultaSaldo();
      } else if (resp === "Depositar") {
        deposita();
      } else if (resp === "Sacar") {
        saca();
      } else {
        voltarMenuPrincipal();
      }
    })
    .catch((err) => {
      console.log(err);
      voltarMenuPrincipal();
    });
}

function consultaSaldo() {
  console.log("### Consultando saldo ###");

  const saldo = fs.readFileSync(caminhoUsuario);
  const saldoUsuario = JSON.parse(saldo);
  console.log(chalk.bgGreen.white(`Saldo disponível na conta: ${saldoUsuario.saldo}`));

  dashboard();

  //Programe a operação de consulta de saldo aqui
  /*Não esqueça de invocar a função dashboard() após a execução
  da operação para o usuário poder continuar operando sua conta; */
}

function deposita() {
  const saldo = fs.readFileSync(caminhoUsuario);
  const saldoUsuario = JSON.parse(saldo);

  inquirer
      .prompt([
          {
              type: 'input',
              name: 'valor',
              message: chalk.yellow('Informe o valor que deseja depositar: '),
          }
      ])
      .then((value) => {
          let novoSaldo = parseFloat(saldoUsuario.saldo) + parseFloat(value.valor);
          saldoUsuario.saldo = novoSaldo.toFixed(2);

          fs.writeFileSync(caminhoUsuario, JSON.stringify(saldoUsuario));
          console.log(chalk.bgGreen.white(`Depósito realizado com sucesso!`));
          dashboard();
      })
}


function saca() {
  console.log("### Sacando ###");

  const saldo = fs.readFileSync(caminhoUsuario);
  const saldoUsuario = JSON.parse(saldo);

  inquirer
      .prompt([
          {
              type: 'input',
              name: 'valor',
              message: chalk.yellow('Informe o valor que deseja sacar: '),
          }
      ])
      .then((value) => {
          let novoSaldo = parseFloat(saldoUsuario.saldo) - parseFloat(value.valor);
          saldoUsuario.saldo = novoSaldo.toFixed(2);

          fs.writeFileSync(caminhoUsuario, JSON.stringify(saldoUsuario));
          console.log(chalk.bgGreen.white(`Saque realizado com sucesso!`));
          dashboard();
      })
  //Programe a operação de saque aqui
  /*Não esqueça de invocar a função dashboard() após a execução
  da operação para o usuário poder continuar operando sua conta; */
}

module.exports = run;
