import { createStore } from 'vuex'
import axios from 'axios'; //Axios：他のサーバーとやりとりするためのツール

export default createStore({
  state: {
    pokemons: [],
    loading: false,
    searchQuery: '',
    sortOrder: 'asc',
    pokemonDetails: {},
  },
  mutations: {
    SET_POKEMONS(state, pokemons) {
      state.pokemons = pokemons; //pokemonsをstateのpokemonsに流す
    },
    SET_LOADING(state, loading) {
      state.loading = loading; //loadingをstateのloadingに流す
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query; //queryをstateのsearchQueryに流す
    },
    SET_SORT_ORDER(state, order) {
      state.sortOrder = order; //orderをstateのsortOrderに流す
    },
    SET_POKEMON_DETAILS(state, { name, details }) {
      state.pokemonDetails = { ...state.pokemonDetails, [name]: details }; //？？？
    },
  },
  actions: {
    async fetchPokemons({ commit }) { //以下を「fetchPokemons」としてmutationsにコミット
      commit('SET_LOADING', true); //「SET_LOADING」にtrueの値をコミット
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150'); //ポケモンAPIを呼び出し
        commit('SET_POKEMONS', response.data.results); //「SET_POKEMONS」にAPIが返した結果をコミット
      } catch (error) { //エラーの場合
        console.error(error); //コンソールにエラー内容を表示
      } finally { //成功でもエラーでも以下を実行
        commit('SET_LOADING', false); //「SET_LOADING」にfalseの値をコミット
      }
    },
    async fetchPokemonDetails({ commit }, name) { //以下を「fetchPokemonDetails」としてmutationsのnameにコミット
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`); //ポケモンAPIを呼び出し
        commit('SET_POKEMON_DETAILS', { name, details: response.data }); //？？？「SET_POKEMON_DETAILS」のnameにAPIが返した結果をコミット？この書き方のはどこが何を指している？
      } catch (error) {
        console.error(error); //エラーの場合、コンソールにエラー内容を表示
      }
    },
  },
  getters: {
    filteredPokemons: (state) => { //以下の処理を「filteredPokemons」として呼び出せるようにする
      let filtered = state.pokemons.filter(pokemon => //以下を「filtered」とする。配列「pokemons」を絞り込みする。配列のなかの一つのアイテム「pokemon」に対して以下の処理をする
        pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase()) //searchQueryを小文字に変換した文字列が、nameを小文字に変換した文字列に入っている場合（そのアイテムを「filtered」とする）
      );
      if (state.sortOrder === 'asc') { //「sortOrder」が「asc」の場合、
        filtered.sort((a, b) => a.name.localeCompare(b.name)); //「filtered」アイテムを昇順に並べ替え　？？？aとbはどこから出てきた？
      } else {
        filtered.sort((a, b) => b.name.localeCompare(a.name)); //「filtered」アイテムを降順に並べ替え
      }
      return filtered; //filteredを返す
    },
    loading: (state) => state.loading, //stateのloadingを「loading」として呼び出せるようにする
    pokemonDetails: (state) => (name) => state.pokemonDetails[name], //stateのpokemonDetails[name]をpokemonDetailsとして呼び出せるようにする
  },
});
