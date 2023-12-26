const PLAYERS = [
  'Spiderman', 'Captain America', 'Wonderwoman', 'Popcorn', 'Gemwoman', 'Bolt', 'Antwoman', 'Mask', 'Tiger',
  'Captain', 'Catwoman', 'Fish', 'Hulk', 'Ninja', 'Black Cat', 'Volverine', 'Thor', 'Slayer', 'Vader', 'Slingo'
];

class Player {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.image = 'images/super-' + (id + 1) + '.png';
    this.strength = this.getRandomStrength();
    this.type = type;
    this.selected = false;
    this.wins = 0;
  }

  getRandomStrength = () => {
    return Math.ceil(Math.random() * 100);
  };

  view = () => {
    let player = document.createElement('div');
    player.classList.add('player');
    player.setAttribute('data-id', this.id);
    if (this.selected == true) player.classList.add('selected');
    let image = document.createElement('img');
    image.setAttribute('src', this.image);
    let name = document.createElement('div');
    name.textContent = this.name;
    let strength = document.createElement('div');
    strength.textContent = this.strength;
    strength.className = 'strength';
    player.append(image, name, strength);
    return player;
  };
}

class Superwar {
  constructor(players) {
    this.players = players.map((player, i) => {
      let type = i % 2 == 0 ? 'hero' : 'villain';
      return new Player(i, player, type);
    });
    this.score = [0, 0];
    Array.from(document.getElementsByClassName('team')).forEach((elem) =>
      elem.addEventListener('click', (e) => {
        this.handleSelection(e.target);
      })
    );
  }

  viewPlayers = () => {
    let team = document.getElementById('heroes');
    team.innerHTML = '';
    let fragment = this.buildPlayers('hero');
    team.append(fragment);

    team = document.getElementById('villains');
    team.innerHTML = '';
    fragment = this.buildPlayers('villain');
    team.append(fragment);
  };

  buildPlayers = (type) => {
    let fragment = document.createDocumentFragment();
    this.filterPlayers(type).forEach((player) =>
      fragment.append(player.view())
    );
    return fragment;
  };

  filterPlayers = (type) => {
    return this.players.filter((player) => player.type == type);
  };

  handleSelection = (target) => {
    if (!target.classList.contains('player')) target = target.parentNode;
    if (!target.hasAttribute('data-id')) return;

    let selectedId = target.getAttribute('data-id');
    let selectedPlayer = this.players[selectedId];
    this.players
      .filter((player) => player.type == selectedPlayer.type)
      .forEach((player) => (player.selected = false));
    selectedPlayer.selected = true;

    if (this.isFight() === 'clash') this.fight();
    else this.viewPlayers();
  };

  isFight = () => {
    const selectedHeroes = this.players.filter(player => player.selected && player.type === 'hero');
    const selectedVillains = this.players.filter(player => player.selected && player.type === 'villain');

    if (selectedHeroes.length === 1 && selectedVillains.length === 1) {
      return 'clash';
    } else {
      return 'peace';
    }
  };

  calculateScore = () => {
    const score = { 'hero': 0, 'villain': 0 };

    this.players.forEach(player => {
      if (player.selected) {
        score[player.type] += player.strength;
      }
    });

    return score;
  };

  checkWin = () => {
    const score = this.calculateScore();

    if (score['hero'] > score['villain']) {
      return 'hero';
    } else if (score['hero'] < score['villain']) {
      return 'villain';
    } else {
      return 'endure';
    }
  };

  totalStrength = (type) => {
    const teamPlayers = this.players.filter(player => player.type === type);
    let totalStrength = 0;

    teamPlayers.forEach(player => {
      totalStrength += player.strength;
    });

    return totalStrength;
  };

  announceWinner = (score) => {
    if (score['hero'] == score['villain']) alert('Its a draw!');
    else if (score['hero'] > score['villain']) alert('Heroes Win!');
    else alert('Villains Win!');
    location.reload();
  };

  fight = () => {
    const score = this.calculateScore();

    // Perform your fight logic here based on the 'score'

    if (this.checkWin() !== 'endure')
      setTimeout(() => this.announceWinner(score), 100);
  };
}

window.onload = () => {
  const superwar = new Superwar(PLAYERS);
  superwar.viewPlayers();
};
