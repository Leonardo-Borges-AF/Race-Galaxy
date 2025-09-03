import fastify from "fastify";

// 🚀 Criando a instância do servidor Fastify com logger ativado
const server = fastify({
  logger: true,
});

// 👽 Dados fictícios para o nosso universo de "Galactic Race"
const teams = [
  { id: 1, name: "Galactic Titans", base: "Triton-7 Base" },
  { id: 2, name: "Nebula Nomads", base: "Orion Asteroid Belt" },
  { id: 3, name: "Starlight Syndicate", base: "Xylos-Prime" },
];

const ships = [
  {
    id: 1,
    name: "Starfarer 9000",
    model: "SF-9K",
    crew: "Max Verstappen",
    team: "Galactic Titans",
  },
  {
    id: 2,
    name: "Vortex Vanguard",
    model: "VV-10",
    crew: "Lewis Hamilton",
    team: "Nebula Nomads",
  },
  {
    id: 3,
    name: "Comet Chaser",
    model: "CC-42",
    crew: "Lando Norris",
    team: "Galactic Titans",
  },
  {
    id: 4,
    name: "Nova Navigator",
    model: "NN-7",
    crew: "Charles Leclerc",
    team: "Starlight Syndicate",
  },
  {
    id: 5,
    name: "Quantum Raptor",
    model: "QR-0",
    crew: "Oscar Piastri",
    team: "Nebula Nomads",
  },
];

const races = [
  { id: 1, name: "Circuit Alpha Centauri", laps: 10, winner: "Starfarer 9000" },
  { id: 2, name: "Vortex of Vega", laps: 15, winner: "Vortex Vanguard" },
  { id: 3, name: "The Great Andromeda", laps: 20, winner: null }, // Corrida em andamento
];

// --- Rotas da API ---

// 🏁 Rota para listar todas as equipes
server.get("/teams", async (request, reply) => {
  return teams;
});

// 🚀 Rota para listar todas as naves
server.get("/ships", async (request, reply) => {
  return ships;
});

// 🏆 Rota para listar todas as corridas
server.get("/races", async (request, reply) => {
  return races;
});

// 🔍 Rota para buscar uma nave por ID
interface ShipParams {
  id: string;
}
server.get<{ Params: ShipParams }>("/ships/:id", async (request, reply) => {
  const id = parseInt(request.params.id);
  const ship = ships.find((s) => s.id === id);

  if (!ship) {
    reply.code(404).send({ message: "Nave não encontrada!" });
  } else {
    reply.send(ship);
  }
});

// 🔎 Rota para buscar naves por equipe (exemplo: /ships/by-team/Galactic%20Titans)
interface TeamParams {
  team: string;
}
server.get<{ Params: TeamParams }>(
  "/ships/by-team/:team",
  async (request, reply) => {
    const teamName = request.params.team;
    const teamShips = ships.filter(
      (s) => s.team.toLowerCase() === teamName.toLowerCase()
    );

    if (teamShips.length === 0) {
      reply.code(404).send({
        message: `Nenhuma nave encontrada para a equipe "${teamName}".`,
      });
    } else {
      reply.send(teamShips);
    }
  }
);

// 👑 Rota para buscar o vencedor de uma corrida por ID (exemplo: /races/1/winner)
interface RaceParams {
  id: string;
}
server.get<{ Params: RaceParams }>(
  "/races/:id/winner",
  async (request, reply) => {
    const id = parseInt(request.params.id);
    const race = races.find((r) => r.id === id);

    if (!race) {
      reply.code(404).send({ message: "Corrida não encontrada." });
      return;
    }

    if (!race.winner) {
      reply
        .code(404)
        .send({ message: "O vencedor desta corrida ainda não foi definido." });
      return;
    }

    reply.send({ winner: race.winner });
  }
);

// 👂 Inicia o servidor e o faz "escutar" a porta 3333
server.listen({ port: 3333 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`🚀 Servidor Galactic Race está no ar em ${address}`);
});
