<template>
  <div>
    <h1>Imot.bg Results {{ offers.length }}</h1>

    <client-only v-if="isLoading">
      <unicon name="spinner" class="spinner" width="80" height="80" />
    </client-only>

    <div class="actionsSection" v-if="!isLoading">
      <h2 class="subTitle">Sort</h2>
      <ul class="actionsList">
        <li class="action">
          <button class="btn" @click="resetSort">Original</button>
        </li>
        <li class="action">
          <button
            class="btn"
            :class="{ active: activeSort === 'asc' }"
            @click="sortOffers('asc')"
          >
            Cheaper first
          </button>
        </li>
        <li class="action">
          <button
            class="btn"
            :class="{ active: activeSort === 'desc' }"
            @click="sortOffers('desc')"
          >
            Expensive first
          </button>
        </li>
      </ul>
    </div>

    <div class="actionsSection" v-if="!isLoading">
      <h2 class="subTitle">Filters</h2>

      <ul class="actionsList">
        <li class="action" v-for="location in locations" :key="location">
          <button
            class="btn"
            :class="{ active: activeFilter === location }"
            @click="locationFilter(location)"
          >
            {{ location }}
          </button>
        </li>
      </ul>
    </div>

    <ul class="resultGrid" v-if="!isLoading">
      <li v-for="(offer, idx) in presentedOffers" :key="idx" class="offer">
        <a :href="offer.url" target="__blank">
          <img :src="offer.imgUrl" alt="" />
          <h2>{{ getLocation(offer.location) }} | {{ offer.price }}</h2>
          <p>{{ offer.desc }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
const customSort = (first, second, dir) => {
  const f = parseInt(first.price, 10);
  const s = parseInt(second.price, 10);
  if (f < s) {
    return dir === "asc" ? -1 : 1;
  }
  if (f > s) {
    return dir === "asc" ? 1 : -1;
  }
  return 0;
};
export default {
  data() {
    return {
      isLoading: true,
      offers: [],
      presentedOffers: [],
      locations: [],
      activeFilter: null,
      activeSort: null,
    };
  },
  methods: {
    getLocation(location) {
      return location.replace("град София, ", "");
    },
    sortOffers(direction) {
      this.activeSort = direction;
      if (direction) {
        this.presentedOffers.sort((first, second) =>
          customSort(first, second, direction)
        );
      }
    },
    resetSort() {
      this.activeSort = null;
      this.presentedOffers = [...this.offers];
      this.locationFilter(this.activeFilter, true);
    },
    locationFilter(location, forceFilter = false) {
      if (this.activeFilter !== location || forceFilter) {
        this.presentedOffers = this.offers.filter((offer) =>
          offer.location.includes(location)
        );
        this.sortOffers(this.activeSort);
        this.activeFilter = location;
      } else {
        this.activeFilter = null;
        this.presentedOffers = [...this.offers];
        this.sortOffers(this.activeSort);
      }
    },
  },
  async mounted() {
    const offers = await this.$axios.$get("/api/cralwer");
    this.offers = [...offers];
    this.presentedOffers = [...offers];
    const locations = offers.map((offer) =>
      offer.location.replace("град София, ", "")
    );
    this.locations = new Set(locations);
    this.isLoading = false;
  },
};
</script>


<style>
/* Global & setup styles */
:root {
  --color-primary: #8a9b68;
  --color-secondary: #b6c197;
  --color-tertiary: #d5ddbc;
  --color-liver: #937b63;
  --color-ruby: #931f1d;
  --color-white: #fff;
}
body {
  padding: 16px;
  background-color: var(--color-tertiary);
}
a {
  text-decoration: none;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
button {
  cursor: pointer;
}

@keyframes rotating {
  from {
    -ms-transform: translate(-50%) rotate(0deg);
    -moz-transform: translate(-50%) rotate(0deg);
    -webkit-transform: translate(-50%) rotate(0deg);
    -o-transform: translate(-50%) rotate(0deg);
    transform: translate(-50%) rotate(0deg);
  }
  to {
    -ms-transform: translate(-50%) rotate(360deg);
    -moz-transform: translate(-50%) rotate(360deg);
    -webkit-transform: translate(-50%) rotate(360deg);
    -o-transform: translate(-50%) rotate(360deg);
    transform: translate(-50%) rotate(360deg);
  }
}
.spinner {
  fill: var(--color-primary);
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
  margin-left: 50%;
  transform: translate(-50%);
  display: inline-block;
}
</style>

<style lang="scss" scoped>
/* Component specific styles */
.btn {
  background-color: var(--color-secondary);
  color: #000;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  text-transform: capitalize;
  transition: all 300ms ease-in-out;
  &:hover,
  &.active {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
}
.actionsSection {
  .subTitle {
    width: 100%;
    margin-bottom: 16px;
  }
  .sortingBtn {
    margin-right: 8px;
  }
  .actionsList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .action {
      margin-right: 12px;
      margin-bottom: 12px;
    }
  }
}

.resultGrid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 16px;
  row-gap: 16px;
  align-items: start;

  .offer {
    background-color: var(--color-primary);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 16px;
    overflow: hidden;
    & > a {
      color: var(--color-white);
      img {
        width: 100%;
        max-height: 250px;
        object-fit: cover;
      }
      h2,
      p {
        padding: 0 16px;
        margin: 18px 0;
      }
    }
  }
}
</style>