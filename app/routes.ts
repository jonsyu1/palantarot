const StaticRoutesInternal = {
  index: () => '/',
  home: () => '/app/home',
  enter: () => '/app/enter',
  recent: () => '/app/recent',
  results: () => '/app/results',
  addPlayer: () => '/app/add-player',
  search: () => '/app/search',
  searchResults: () => '/app/search-results',
  records: () => '/app/records',
  tarothons: () => '/app/tarothons',
  addTarothon: () => '/app/add-tarothon',
  lobby: () => '/app/lobby',
  login: () => '/login',
  rules: () => '/app/rules',
  bots: () => '/app/bots',
}

export const StaticRoutes = StaticRoutesInternal; 
export const StatisRoutesEnumerable: { [key: string]: () => string } = StaticRoutesInternal;

const DynamicRoutesInternal = {
  game: (gameId: string) => `/app/game/${gameId}`,
  tarothon: (tarothonId: string) => `/app/tarothon/${tarothonId}`,
  editTarothon: (tarothonId: string) => `/app/edit-tarothon/${tarothonId}`,
  player: (playerId: string) => `/app/player/${playerId}`,
  edit: (gameId: string) => `/app/edit/${gameId}`,
  play: (gameId: string) => `/play/${gameId}`,
};

export const DynamicRoutes = DynamicRoutesInternal; 
export const DynamicRoutesEnumerable: { [key: string]: (...args: string[]) => string } = DynamicRoutesInternal;
