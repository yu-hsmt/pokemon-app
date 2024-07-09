<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-text-field
                    label="Search Pokemons"
                    v-model="searchQuery"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-btn @click="toggleSortOrder" color="primary">
                    Sort: {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }} <!-- sortOrderが「asc」だったらAscending、そうでなければDescendingという文言を表示 -->
                </v-btn>
            </v-col>
            <v-col cols="12" v-if="loading" class="loading_area"> <!-- loadingがtrueの場合、このエリアを表示 -->
                <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                    ></v-progress-circular>
            </v-col>
            <v-col v-if="!loading" v-for="pokemon in filteredPokemons" :key="pokemon.name" cols="12" md="4">
                <v-card>
                    <v-card-title>{{ pokemonDetails(pokemon.name)?.name || pokemon.name }}</v-card-title> <!-- ？？？pokemon.nameではだめなのか？ -->
                    <v-card-text>
                        <v-img
                            v-if="pokemonDetails(pokemon.name)"
                            :src="pokemonDetails(pokemon.name).sprites.front_default"  
                            :alt="pokemon.name"
                            height="200"  
                        ></v-img>
                        <v-progress-circular
                            v-else
                            interminate
                            color="primary"
                            ></v-progress-circular>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed,watch, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const searchQuery = computed({ //以下をsearchQueryとする
    get: () => store.state.searchQuery, //storeのstateに入っているsearchQueryを取得　？？？なぜこれが必要？
    set: (value) => store.commit('SET_SEARCH_QUERY', value) //searchQueryの値（検索窓に入力した値）をstoreのSET_SEARCH_QUERYの値としてコミット
});

const sortOrder = computed(() => store.state.sortOrder); //storeのstateに入っているsortOrderの値を取得して「sortOrder」とする
const filteredPokemons = computed(() => store.getters.filteredPokemons); //storeのgettersに入っているfilteredPokemonsを「filteredPokemons」とする
const loading = computed(() => store.getters.loading); //storeのgettersに入っているloadingを「loading」とする
const pokemonDetails = (name) => store.getters.pokemonDetails(name); //storenのgettersに入っているpokemonDetails(name)を「pokemonDetails」とする

const fetchPokemons = () => store.dispatch('fetchPokemons') //storeのfetchPokemonを「fetchPokemon」とする
const fetchPokemonDetails = (name) => store.dispatch('fetchPokemonDetails', name);//storeのfetchPokemonDetails(name)を「fetchPokemonDetails」とする

const toggleSortOrder = () => {
    const newOrder = sortOrder.value === 'asc' ? 'desc' : 'asc'; //sortOrderの値が'asc'なら「desc」を、そうでなければ「asc」をnewOrderとする
    store.commit('SET_SORT_ORDER', newOrder); //storeのSET_SORT_ORDERにnewOrderをコミット
};

const loadPokemonDetails = (name) => {
    if (!pokemonDetails(name)) { //？？？pokemonDetails(name)がなかったら？
        fetchPokemonDetails(name); //nameを引数としてfetchPokemonDetailsを実行
    }
};

watch(filteredPokemons, (newPokemons) => { //？？？
    newPokemons.forEach(pokemon => loadPokemonDetails(pokemon.name)); //？？？
});

onMounted(() => {
    fetchPokemons(); //fetchPokemons()を実行
});
</script>

<style scoped>
.loading_area {
    display: flex;
    justify-content: center;
}

.v-btn {
    margin-bottom: 20px;
}
</style>
